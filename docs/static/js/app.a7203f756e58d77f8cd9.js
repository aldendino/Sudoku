webpackJsonp([1],{"9fFe":function(t,e){},"Cn+M":function(t,e){t.exports={range:9,puzzle:[[4,7,0,0,0,5,0,3,0],[2,9,0,0,0,0,4,0,0],[0,0,8,0,7,0,0,1,0],[0,5,0,0,4,1,3,0,0],[0,0,0,5,0,6,0,0,0],[0,0,9,8,3,0,0,5,0],[0,8,0,0,1,0,5,0,0],[0,0,5,0,0,0,0,6,4],[0,6,0,3,0,0,0,2,7]],solution:[[4,7,1,9,6,5,2,3,8],[2,9,6,1,8,3,4,7,5],[5,3,8,4,7,2,9,1,6],[6,5,7,2,4,1,3,8,9],[8,2,3,5,9,6,7,4,1],[1,4,9,8,3,7,6,5,2],[7,8,2,6,1,4,5,9,3],[3,1,5,7,2,9,8,6,4],[9,6,4,3,5,8,1,2,7]]}},NHnr:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r("7+uW"),u={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var a=r("VU/8")({name:"App"},u,!1,function(t){r("huS6")},null,null).exports,i=r("/ocq"),o=r("Cn+M"),s=r.n(o).a,l=r("Gu7T"),c=r.n(l),f=r("Zx67"),h=r.n(f),g=r("zwoO"),v=r.n(g),d=r("Pf15"),p=r.n(d),S=r("Zrlr"),q=r.n(S),m=r("wxAW"),w=r.n(m),b=r("RRo+"),V=r.n(b),C=r("cp0u"),_=9;function k(t,e){if(!function(t,e){return e>=0&&e<=t}(t,e))throw new Error("Value must be between 0 and the range inclusive.")}function y(t,e){return V()(e)&&e>=0&&e<=t}function O(t){if(!function(t){return V()(t)&&t>0&&Math.sqrt(t)%1==0}(t))throw new Error("Range must be an integer greater than 0 and a perfect square.")}function R(t,e){if(!y(t,e))throw new Error("Value must be an integer or null and between 1 and the range inclusive.")}var E=function(){function t(){var e=this,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:_,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;if(q()(this,t),O(r),!y(r,n))throw new Error("Value must be an integer or null and between 1 and the range inclusive.");var u=r,a=n,i=0!==n;this.isOriginal=function(){return i},this.getRange=function(){return u},this.getValue=function(){return a},this.setValue=function(t){e.validate(t),a=t}}return w()(t,[{key:"validate",value:function(t){R(this.getRange(),t)}}]),t}();!function(t){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return q()(this,e),v()(this,(e.__proto__||h()(e)).call(this,_,t))}p()(e,t)}(E);function M(t,e){if(e.length!==t)throw new Error("Number of rows must equal the range.");if(0!==e.map(function(e){return e.length===t}).filter(function(t){return!t}).length)throw new Error("Number of elements in each column must equal the range.");e.forEach(function(e){e.forEach(function(e){R(t,e)})})}function P(t,e){return t.map(function(t){return t.map(function(t){return e(t)})})}function x(t){for(var e=new Array(t),r=0;r<e.length;r++)e[r]=new Array(t);return e}function A(t){var e={};return t.forEach(function(t){t.forEach(function(t){e[t]=t})}),e}function H(t,e){var r=e.row,n=e.column,u=Math.sqrt(t);return{superSquare:Math.floor(r/u)*u+Math.floor(n/u),square:r%u*u+n%u}}var j=Object(C.partial)(H,_);function T(t,e){var r=e.superSquare,n=e.square,u=Math.sqrt(t),a=r%u;return{row:Math.floor(r/u)*u+Math.floor(n/u),column:a*u+n%u}}var z=Object(C.partial)(T,_);function F(t,e){for(var r=x(t),n=0;n<e.length;n++)for(var u=e[n],a=0;a<u.length;a++){var i=u[a],o=H(t,{row:n,column:a}),s=o.superSquare,l=o.square;r[s][l]=i}return r}var N=function(t){function e(t){return q()(this,e),v()(this,(e.__proto__||h()(e)).call(this,_,t))}return p()(e,t),e}(function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:_,r=arguments[1];q()(this,t),O(e),M(e,r);var n=e,u=function(t,e){return M(t,e),P(e,function(e){return new E(t,e)})}(e,r);this.getRange=function(){return n},this.getState=function(){return u},this.stateValues=P(u,function(t){return t.getValue()}),this.possibilities=[].concat(c()(Array(e+1).keys())).slice(1)}return w()(t,[{key:"getStateValues",value:function(){return P(this.getState(),function(t){return t.getValue()})}},{key:"getStateOriginality",value:function(){return P(this.getState(),function(t){return t.isOriginal()})}},{key:"getStateValuesTransposed",value:function(){return function(t,e){for(var r=x(t),n=0;n<e.length;n++)for(var u=e[n],a=0;a<u.length;a++){var i=u[a];r[a][n]=i}return r}(this.getRange(),this.getStateValues())}},{key:"getStateValuesCollated",value:function(){return F(this.getRange(),this.getStateValues())}},{key:"setIndex",value:function(t,e,r){k(this.getRange(),t),k(this.getRange(),e),this.getState()[t][e].setValue(r),this.stateValues=P(this.getState(),function(t){return t.getValue()})}},{key:"getPossibleValuesHelper",value:function(t,e){var r=this.getStateValues();if(0!==r[t][e])return[];var n=r[t],u=this.getStateValuesTransposed()[e],a=j({row:t,column:e}),i=A([n,u,this.getStateValuesCollated()[a.superSquare]].map(function(t){return t.filter(function(t){return 0!==t})}));return this.possibilities.filter(function(t){return!i[t]})}},{key:"getPossibleValues",value:function(t,e){var r=this,n=this.getPossibleValuesHelper(t,e);if(0===n.length||1===n.length)return n;var u=A(function(t,e,r){for(var n=H(t,{row:e,column:r}),u=[],a=0;a<t;a++)a!==n.square&&u.push(T(t,{superSquare:n.superSquare,square:a}));return u}(this.getRange(),t,e).map(function(t){return r.getPossibleValuesHelper(t.row,t.column)}));return n.filter(function(t){return!u[t]})}}]),t}()),W=r("g2Wd"),I={data:function(){return{board:new N(s.puzzle),currentSquare:null}},computed:{state:function(){return this.board.stateValues},originality:function(){return this.board.getStateOriginality()},stateFlat:function(){return Object(W.flatten)(this.state)},stateTransposed:function(){return this.board.getStateValuesTransposed()},stateCollated:function(){return t=this.state,F(_,t);var t},currentCoords:function(){return null==this.currentSquare?null:z(this.currentSquare)},currentPossibilities:function(){return null==this.currentCoords?[]:this.board.getPossibleValuesHelper(this.currentCoords.row,this.currentCoords.column)},currentOptions:function(){return null==this.currentCoords?[]:this.board.getPossibleValues(this.currentCoords.row,this.currentCoords.column)}},methods:{handleClick:function(t){var e=z(t);if(this.currentOptions&&1===this.currentOptions.length){var r=e.row,n=e.column,u=this.currentOptions[0];this.board.setIndex(r,n,u),console.log("Set: "+r+":"+n+" = "+u)}},setCurrentSquare:function(t){this.currentSquare=t},isCurrentSquare:function(t){if(null==this.currentSquare)return!1;var e=z(this.currentSquare),r=z(t);return e.row===r.row&&e.column===r.column},isRelativeSquare:function(t){if(null==this.currentSquare)return!1;var e=z(this.currentSquare),r=z(t);return!(this.currentSquare.superSquare!==t.superSquare&&e.row!==r.row&&e.column!==r.column||e.row===r.row&&e.column===r.column)},isOriginalSquare:function(t){var e=z(t);return this.originality[e.row][e.column]},handleMouseOver:function(t){this.setCurrentSquare(t)}}},U={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"page-center"},[r("div",{staticClass:"sudoku-board sudoku-grid",on:{mouseout:function(e){t.currentSquare=null}}},t._l(t.stateCollated,function(e,n){return r("div",{key:n,staticClass:"sudoku-grid"},t._l(e,function(e,u){return r("div",{key:u,staticClass:"sudoku-square",class:{current:t.isCurrentSquare({superSquare:n,square:u}),relative:t.isRelativeSquare({superSquare:n,square:u}),original:t.isOriginalSquare({superSquare:n,square:u})},on:{click:function(e){t.handleClick({superSquare:n,square:u})},mouseover:function(e){t.handleMouseOver({superSquare:n,square:u})}}},[t._v("\n        "+t._s(0!==e?e:" ")+"\n      ")])}))})),t._v(" "),r("div",{staticClass:"hud"},[t._v("\n    "+t._s("["+t.currentPossibilities.join(", ")+"] => [")),r("span",{staticClass:"answer"},[t._v(t._s(t.currentOptions.join(", ")))]),t._v(t._s("]")+"\n  ")])])},staticRenderFns:[]};var Z=r("VU/8")(I,U,!1,function(t){r("9fFe")},"data-v-aeaaa7ee",null).exports;n.a.use(i.a);var $=new i.a({routes:[{path:"/",name:"Home",component:Z}]});n.a.config.productionTip=!1,new n.a({el:"#app",router:$,components:{App:a},template:"<App/>"})},huS6:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.a7203f756e58d77f8cd9.js.map