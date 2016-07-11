# Spartan

A highly customizable yet tiny, standalone LessCSS grid system. Try the [dynamic online demo](http://spartan-grid.herokuapp.com/).

> Requires [LessCSS](https://github.com/less/less.js) version 1.6.0 or above. Does **not** work with v1.7.0 
because of [this bug](https://github.com/less/less.js/pull/1929#issuecomment-45307325) (fixed in v1.7.1).

> [Tested with Less.php](http://lessphp.gpeasy.com/Demo) version 1.6.3

## What sets Spartan apart?

Spartan can mainly shine through its very unique [**grid creation API**](#grid-setup).
While you define some variables in other grid systems which will then be used to create a predefined grid structure, 
Spartan provides you with a sensible set of less mixins to freely customize your setup and get the most out of our grid system:
**you define** how you want to use **your grid**!

- [Features](#features)
- [Comparison with other Grids](#comparison)
- [Getting Started](#getting-started)
- [Grid Structure](#grid-structure)
- [Basic Usage](#basic-usage)
	- [Grid Setup](#grid-setup)
	- [Grid Classes and Mixins](#grid-classes-and-mixins)
- [Advanced Usage](#advanced-usage)
- [Browser Support](#browser-support)
	- [The Safari Problem](#the-safari-problem)

## Features

- supports all features of other common grid systems:
	- fluid or static grid
	- fully responsive
	- block gutter (fixed gutter in a fluid grid)
	- column offsets
	- column reordering
- grid creation API for maximum flexibility
- customizable css classes
- tiny: **1.8KB** of minified base css

## Comparison

> Install [Chromoji](https://chrome.google.com/webstore/detail/chromoji-emoji-for-google/cahedbegdkagmcjfolhdlechbkeaieki?hl=en-GB) if you're using Chrome to see the icons.

|                           | [Spartan](http://spartan-grid.herokuapp.com) | [Bootstrap](http://getbootstrap.com/css/#grid) | [Foundation](http://foundation.zurb.com/) | [Profound](http://www.profoundgrid.com/) |
|---------------------------|:-------:|:-----------------:|:----------:|:-------:|
| less                      | ✅ | ✅ | ❌ | ❌ |
| sass                      | ❌ | ✅ | ✅ | ✅ |
| fluid                     | ✅ | ✅ | ✅ | ✅ |
| static                    | ✅ | ✅ | ✅ | ✅ |
| responsive                | ✅ | ✅ | ✅ | ✅ |
| block gutter              | ✅ | ✅ | ✅ | ❌ |
| column ordering           | ✅ | ✅ | ✅ | ✅ |
| offsets                   | ✅ | ✅ | ✅ | ✅ |
| multiple grids            | ✅ | ❌ | ❌ | ✅ |
| custom classes            | ✅ | ❌ | ❌ | ✅ |
| output css (min)          | **1.8-5KB** | **8.3KB** | **15.1KB** | **~10KB** |

## Getting Started

- Install [Node](http://nodejs.org/) and then LessCSS: `npm install -g less`

### Have a Project at the Ready?

- Integrate [`src/spartan.less`](https://github.com/SimonHarte/SpartanGrid/blob/master/src/spartan.less) in your project
- Use the [API mixin(s)](#grid-setup) to set up your grid

> Spartan will not generate any CSS until you use the setup API.

### Just want to fiddle around?

- Download Spartan
- Adjust `grid-setup.less`
- Execute: `sh scripts/compile.sh`

## Grid Structure

Here's a short example of Spartans base structure in a 12-column grid:

**HTML**

```html
<div class="g-row">
	<div class="g-col g-span-3"></div>
	<div class="g-col g-span-3"></div>
	<div class="g-col g-span-3"></div>
	<div class="g-col g-span-3"></div>
</div>
```

- `.g-row` initializes a grid row with negative left margin (gutter) and uses [H5BP clearfix](https://github
.com/h5bp/html5-boilerplate/blob/master/css/main.css#L161) to contain the floating `.g-col`s.
- `.g-col` applies default column styles like float and padding (gutter).
- `.g-span-<columns>` applies a column based width according ot the set maximum amount of columns.

Check out [responsive approaches](https://github.com/SimonHarte/SpartanGrid/blob/develop/Documentation.md#responsive-approaches) with Spartan.

## Basic Usage

### Grid Setup

There are two ways to set up a grid with Spartan, within the basic usage we only explain the simpler one. If you need more flexibility, to set up viewport dependent grids etc. go to the [advanced usage](#responsiveness-and-customization) section.

The basic grid setup requires you to call just one mixin, pass in a configuration and an optional prefix (read more about custom classes in the [documentation](https://github.com/SimonHarte/SpartanGrid/blob/master/Documentation.md#custom-classes)).

```less
@grid-config: <grid-width>, <grid-type>, <gutter-width>, <gutter-type>, <grid-columns>;

.grid-bundle([prefix], @grid-config);
```

If you are not using a grid prefix, you have to name the config param, so `.grid-bundle()` correctly receives the configuration and doesn't think it's the prefix.

```less
.grid-bundle(@config: @grid-config);
```

#### Setup Params

| Param | Type | Value | Comment |
|-------|:-----|:------|:--------|
| `[prefix]`       | string | | quotes optional |
| `<grid-width>`   | pixel   | | |
| `<grid-type>`    | string  | `fluid` or `fixed` | quotes optional |
| `<gutter-width>` | number | | `px`, `%` or `em/rem`, only reacts to `<gutter-type>` with `px` |
| `<gutter-type>`  | string  | `fluid` or `fixed` | forced to `fixed` if `<grid-type>` is `fixed` |
| `<grid-columns>` | integer | | | |

#### Example Setup

**LessCSS**

```less
@grid-config: 940px, 'fluid', 20px, 'fixed', 12;

.grid-bundle(@config: @grid-config);
```

### Grid Classes and Mixins

Spartan comes with an integrated LessCSS loop to generate grid classes according to your configuration. Instead of using
the generated classes you can also use similar named mixins to apply the grid in a less style sheet.

```less
.grid-span(<columns>), .g-span-{columns}
.grid-offset(<columns>), .g-offset-{columns}
.grid-push(<columns>), .g-push-{columns}
.grid-pull(<columns>), .g-pull-{columns}
```

#### `grid-span`
Override the width of a column (default is full-width), equivalent to `.g-span-{columns}`. This mixin allows you to pass
in floating point numbers, which enables you to define literally **any** width using the mixin.

```less
// 5 columns per line in a 12 column grid
.grid-span(12/5);
```

#### `grid-offset`
Indent a column by the defined amount of grid columns, equivalent to `.g-offset-{columns}`.
While there are just positive indents in generated classes, you could also call this mixin with negative values.

> **Note:** Using negative indents generally only works in static width grids.

#### `grid-push` and `grid-pull`
Together with the additional class `.g-reorder` on `.g-row` you can reorder columns visually without changing the 
order in HTML. Equivalent to `.g-push-{columns}` and `.g-pull-{columns}`, similar behavior as `.grid-offset()`.

> Note that you may run into problems if these are used within certain responsive layouts as they use relative positioning.

##### `grid-reorder`

You can alternatively use `.grid-reorder()` and pass in any number. If the passed number is positive or zero, it will
simply call `.grid-push()` and if the number is negative `.grid-pull()` instead.

## Advanced Usage

There's a detailed [documentation](https://github.com/SimonHarte/SpartanGrid/blob/master/Documentation.md) about every aspect of Spartan with different approaches to setting up your most flexible grid.

Overview:

- [Grid Creation API](https://github.com/SimonHarte/SpartanGrid/blob/master/Documentation.md#grid-creation-api)
- [Viewport Dependent Configs](https://github.com/SimonHarte/SpartanGrid/blob/master/Documentation.md#viewport-dependent-configurations)
- [Custom Classes](https://github.com/SimonHarte/SpartanGrid/blob/master/Documentation.md#custom-classes)
- [Semantic Grid](https://github.com/SimonHarte/SpartanGrid/blob/master/Documentation.md#semantic-grid)
- [Responsive Approaches](https://github.com/SimonHarte/SpartanGrid/blob/master/Documentation.md#responsive-approaches)

## Browser Support

**Not** supported:

- **IE7-**

**Partially** supported:

- **IE8**: basic grid working properly, no media query support and `:nth-child` clearing, 
**Note:** fully supported with [respond.js](https://github.com/scottjehl/Respond) and [selectivizr.js]
(http://selectivizr.com/) polyfills
- **Safari**: as explained [below](#the-safari-problem)

### The Safari Problem

Unfortunately all Safari browsers up to the latest version have a bad subpixel rendering for widths and always round 
values down to the next integer when calculating rendered pixels. So a width declaration of for example `88.333px` or
 even `88.666px` will always be rendered as `88px`. This of course presents an issue when your grid configuration 
 leads to such values or in general when you use a fluid grid, because we get a small displacement of columns.

There's an [article from John Resig](http://ejohn.org/blog/sub-pixel-problems-in-css/) about this subject.

Note that all grid systems suffer from this issue and merely provide workarounds in some cases,
Spartan does not try to do that but optimises its precision to avoid bad pixel rendering as much as possible.
