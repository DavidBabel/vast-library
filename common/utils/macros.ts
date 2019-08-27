export function replaceVastMacros(url : string, vars : any) : string {
    vars['TIMESTAMP'] = new Date().toISOString();

    [/*A possibly incomplete list of MACROS that requires an escape */
     'ADPLAYHEAD',
     'ASSETURI',
     'CLIENTUA',
     'CONTENTID',
     'CONTENTPLAYHEAD',
     'CONTENTURI',
     'DEVICEIP',
     'DEVICEUA',
     'DOMAIN',
     'MEDIAMIME',
     'MEDIAPLAYHEAD',
     'PAGEURL',
     'SERVERUA',
     'TIMESTAMP'
    ].forEach(k => {
        if (vars[k]) {
            vars[k] = encodeURIComponentRFC3986(vars[k]);
        }
    });

    vars['RANDOM'] =
    vars['CACHEBUSTING'] = Math.round(1.0e9 + Math.random() * 1.0e8).toString().substring(1);

    if (typeof url === 'string') {
        for (const key in vars) {
            const value = vars[key];

            url = url.replace(`[${key}]`, value).replace(`%%${key}%%`, value);
        }
    }

    return url;
}

function encodeURIComponentRFC3986(str : string) : string {
    return encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`);
}
