<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{htmlTitle}}</title>
    <link rel="stylesheet" href="{{yuiGridsUrl}}">
    <link rel="stylesheet" href="{{projectAssets}}/vendor/prettify/prettify-min.css">
    <link rel="stylesheet" href="{{projectAssets}}/css/main.css" id="site_styles">
    <link rel="stylesheet" href="{{projectAssets}}/css/custom.css" id="site_custom">
    <link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="shortcut icon" type="image/png" href="{{projectAssets}}/favicon.png">
    <script src="{{yuiSeedUrl}}"></script>
</head>
<body class="yui3-skin-sam">
<div class="github-fork-ribbon-wrapper right">
    <div class="github-fork-ribbon">
        <a href="https://github.com/sw4/pocketknife/" target="_new">Fork me on GitHub</a>
    </div>
</div>
<div id="doc">
    <div id="hd" class="yui3-g header">
        <div class="yui3-u-3-4">
            {{#if projectLogo}}
                <h1><img src="{{projectLogo}}" title="{{projectName}}"></h1>
            {{else}}
                <h1><img src="{{projectAssets}}/css/logo.png" title="{{projectName}}"></h1>
            {{/if}}
        </div>
        <div class="yui3-u-1-4 version">
            <em>API Docs for: {{projectVersion}}</em>
        </div>
    </div>
    <div id="bd" class="yui3-g">

        <div class="yui3-u-1-4">
            <div id="docs-sidebar" class="sidebar apidocs">
                {{>sidebar}}
            </div>
        </div>
        <div class="yui3-u-3-4">
            {{>options}}
            <div class="apidocs">
                <div id="docs-main">
                    <div class="content">
                        {{>layout_content}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="{{projectAssets}}/vendor/prettify/prettify-min.js"></script>
<script>prettyPrint();</script>
<script src="{{projectAssets}}/js/yui-prettify.js"></script>
<script src="{{projectAssets}}/../api.js"></script>
<script src="{{projectAssets}}/js/api-filter.js"></script>
<script src="{{projectAssets}}/js/api-list.js"></script>
<script src="{{projectAssets}}/js/api-search.js"></script>
<script src="{{projectAssets}}/js/apidocs.js"></script>
</body>
</html>
