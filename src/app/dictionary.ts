export interface Dictionary {
    'language': string,
    'entries': Array<{
        'english': string,
        'common': string,
        'capitalized': string,
        'allCaps': string
    }>
}
