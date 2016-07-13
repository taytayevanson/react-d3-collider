## React D3.js Collider
A port of a D3.js example called [Collision Detection](http://bl.ocks.org/mbostock/3231298) from raw D3.js to two React components. It's built on top of @kriasoft's [React Static Boilerplate](https://github.com/kriasoft/react-static-boilerplate).

If you're checking it out to look at the code, look at [`components/Collider/Collider.js`](https://github.com/taytayevanson/react-d3-collider/blob/master/components/Collider/Collider.js): that's where the D3.js React components are found.

I'm new to React, there's definitely 100 better ways to do this. But it was a good learning experience! It's slower than the example, but since the main Collider class is built in React, and each circle, there's some awesome integration potential. I also noticed after building it that there is a [canvas version](http://bl.ocks.org/mbostock/3231307) of the D3 example that I remember trying once, and found it to be faster; in my experience, canvas is faster than SVG.

### Installation
`npm install`

`node run`
