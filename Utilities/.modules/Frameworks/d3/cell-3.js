$$.async()
/*
d3TreeToSVG([
    {
        name: '@angular/router',
        children: [
            {
                name: 'app.component'
            },
            {
                name: 'login.component'
            }
        ]
    }
])
*/

d3TreeToSVG([
    {
        name: '@angular/core'
    },
    {
        name: 'app.component'
    },
    {
        name: 'login.component'
    }
], [
    {
        source: '@angular/core',
        target: 'app.component'
    },
    {
        source: '@angular/core',
        target: 'login.component'
    }

])
    .then(svg => $$.svg(svg))
    .catch(e => $$.sendError(e));

