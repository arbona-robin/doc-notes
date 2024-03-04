---
title: Background Paper Effect
description: SVG filters and CSS gradient to create texture background
date: 2024-03-03
tags: css, svg, filter, background, texture, paper, effect, grain
---

Use SVG filters and CSS gradients to create a grainy background effect.

https://css-tricks.com/grainy-gradients/


Create pattern with SVG filter.

https://css-tricks.com/creating-patterns-with-svg-filters/


Paper texture effect.

```html
<div></div>

<svg>
    <filter id='roughpaper'>
        <feTurbulence type="fractalNoise" baseFrequency='0.04 0.06' result='noise' numOctaves="3" />
        <feDiffuseLighting in='noise' lighting-color='#FEFEF9' surfaceScale='1'>
            <feDistantLight azimuth='65' elevation='69' />
        </feDiffuseLighting>
    </filter>
</svg>
```

```css
html, body {
    width: 100%;
    height: 100%;
    display: flex;
} 

svg {
    width: 0;
    height: 0;
}

div {
    margin: auto;
    width: 650px;
    height: 500px;
    filter: url(#roughpaper);
}
```