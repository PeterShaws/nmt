export interface Entry {
    'english': string,
    'common': string,
    'capitalized': string,
    'allCaps': string
}

export interface Dictionary {
    'language': string,
    'entries': Array<Entry>
}
