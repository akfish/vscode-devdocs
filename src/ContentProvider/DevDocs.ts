import {
    Event,
    Uri,
    CancellationToken,
    TextDocumentContentProvider,
    EventEmitter
} from 'vscode'
import defaults = require('lodash/defaults')

export const SCHEME = 'devdocs'

const DEFAULT_QUERY: Query = {
    route: '/',
    live: false
}

function applyDefaultsToQuery(query: Query) {
    let q = defaults({}, query, DEFAULT_QUERY)
    if (q.route !== '/' && !!q.keyword) {
        console.warn('query.keyword will be ingnored for non-root route') 
    }
    return q
}

export interface Query {
    keyword?: string
    route?: '/' | '/settings' | '/offline'
    live?: boolean
}

export function encodeDevDocsUri(query?: Query): Uri {
    return Uri.parse(`${SCHEME}://search?${JSON.stringify(applyDefaultsToQuery(query))}`)
}

export function decodeDevDocsUri(uri: Uri): Query {
    // TODO: runtime validation
    return <Query>JSON.parse(uri.query)
}

const HTML_CONTENT = (query: Query) => `
<style>
body{
    margin: 0;
    padding: 0;
}
iframe {
    position: absolute;
    border: none;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
</style>

<body>
    <iframe src="http://devdocs.io${query.route}#q=${query.keyword || ''}">
    </iframe>
</body>
`

export class DevDocsContentProvider implements TextDocumentContentProvider {
    private _onDidChange = new EventEmitter<Uri>()
    get onDidChange(): Event<Uri> {
        return this._onDidChange.event
    }

    public update(uri: Uri) {
        this._onDidChange.fire(uri)
    }
    provideTextDocumentContent(uri: Uri, token: CancellationToken): string | Thenable<string> {
        return HTML_CONTENT(decodeDevDocsUri(uri))
    }
}