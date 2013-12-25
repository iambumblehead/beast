beast
=====
**(c)[Bumblehead][0], 2013** [MIT-license](#license)

### Overview:

provides a timer'd loop with hooks producing various animated effects. it is optimised for simple animated effects on elements.

two things beast does to improve efficiency:

  1. **performs multiple animated trasitions with one loop**
     - allows tight synchronization of animated effects
     - one timer for several effects is better than several timers
  2. **pre-processes to obtain loop values**
     - values that modify target elements at each frame are generated first
     - values are generated when animation starts

animations are performed with plugins -4 plugins are provided by default:

  1. [*fade*](#plugin-fade) an element's opacity
  2. [*color*](#plugin-color) transition an element to another color
  3. [*move*](#plugin-move) an element to an absolute position
  4. [*shape*](#plugin-shape) an element's height or width


[0]: http://www.bumblehead.com                            "bumblehead"
[1]: https://github.com/iambumblehead/beast                    "beast"

---------------------------------------------------------
#### <a id="install"></a>Install:

beast may be downloaded directly or installed through `npm`.

 * **npm**   

 ```bash
 $ npm install beast
 ```

 * **Direct Download**
 
 ```bash  
 $ git clone https://github.com/iambumblehead/beast.git
 ```

Beast is meant to be npm-installed and deployed with [scroungejs][3]. Alternatively, this repository contains two ready-to-use files, [beast.min.js][6] and [beast.unmin.js][7].

Run `npm start` to build a sample beast page and to see an advanced component constructed around beast as an example.


[3]: https://github.com/iambumblehead/scroungejs          "scroungejs"
[6]: http://github.com/iambumblehead/scroungejs/raw/master/beast.min.js
[7]: http://github.com/iambumblehead/scroungejs/raw/master/beast.unmin.js

---------------------------------------------------------
#### <a id="test"></a>Test:

 to run tests, use `npm test` from a shell.

 ```bash
 $ npm test
 ```

---------------------------------------------------------
#### <a id="get-started">GET STARTED:

 - **fade element out**

 ```javascript
 beast({ 
     frames : 30 
 }).fade({ 
     elem : elem, 
     opend : 0
 }).init();
 ```

 - **fade element in**

 ```javascript
 beast({ 
     frames : 30 
 }).fade({ 
     elem : elem, 
     opend : 100
 }).init();
 ```

 - **shape and fade element simultanaeously**

 ```javascript
 beast({ 
     frames : 30 
 }).fade({ 
     elem : elem, 
     opend : 0
 }).shape({ 
     elem : elem, 
     whend : [300, 200]     
 }).init();
 ```

 - **shape, fade and color element simultanaeously**
 
 ```javascript
 beast({ 
     frames : 30 
 }).fade({ 
     elem : elem, 
     opend : 0
 }).shape({ 
      elem : elem, 
     whend : [300, 200]     
 }).color({ 
     elem : elem, 
     bgnColor : '#fff',
     endColor : '#259c14',
     bgnBackgroundColor : 'rgb(255, 0, 0)',
     endBackgroundColor : 'rgb(0, 0, 0)'    
 }).init();
 ``` 

 - **shape two elements simultanaeously, control the timing**

 ```javascript
 beast({ 
     frames : 30 
 }).shape({ 
     elem : elem, 
     ease : 'end',
     whend : [300, 200]     
 }).shape({ 
     elem : elem2, 
     ease : 'bgn',
     whend : [300, 200]     
 }).init();
 ```

 - **use classnames during animation**
 
 An element receives a className during animation. The className is  'st-:name-beast-animating', where :name becomes the name of the module. This element would get the className 'st-move-beast-animating'.

 ```css
 .st-move-beast-animating {
     position:absolute;
 }
 ```

 ```javascript
 beast({ 
     frames : 30 
 }).move({ 
     elem : elem, 
     ltend : [300, 200] 
 }).init();
 ```

 - **use classnames after animation**
 
   plugins remove styles added to elem when animation finishes. Use `classNameEnd` to add a className to elem when the animation is complete. To prevent a plugin from removing styles, define `isclean` as `false`.

 ```css
 .st-vis-hide {
     opacity:0;
 }
 ```

 ```javascript
 beast({
     frames : 6
 }).fade({
     classNameEnd : 'vis-hide',
     isclean : false,
     elem : elem, 
     endop : 0
 }).init();
 ```

 - **shape, then fade an element**

 ```javascript
 beast({
     frames : 6
 }).shape({
     elem : elem,
     whbgn : [2000, 2000],
     classNameFin : 'show-open'
 }).init(function () {
     that.fade = beast({
         frames : 6
     }).fade({
         classNameEnd : 'vis-hide',
         elem : elem, 
         endop : 0
     }).init();
 });
 ```

 - **subscribe functons to events**
 
   The 'init' method passes a function to one of beast object's hook methods. Access the hooks directly.

 ```javascript
 beast({
     frames : 6
 }).shape({
     elem : elem,
     whbgn : [0, 300]
 }).onBegin(function () {
     console.log('animation is starting');
 }).onKill(function () {
     console.log('animation was killed!');    
 }).onComplete(function () {
     console.log('animation is complete');        
 }).init();
```

 - **kill initialized animation**

 ```javascript
 var mybeast = beast({
     frames : 6000
 }).shape({
     elem : elem,
     whbgn : [0, 300]
 }).init();
   
 setTimeout(function () { mybeast.kill(); }, 10000);
 ```

---------------------------------------------------------
#### <a id="more">More:

 * **beast**
 
 Two properties are useful for the beast constructor.
 
 ```javascript
 beast({
     frames : 300,
     fps : 30 // frames per second
 })
 ```

 * **beast.proto**
 
 proto is not a method but a property defined on beast the namespace. the prototype is used by beast to construct objects it returns. proto may be accessed to redefine its default properties.

 * **beast.proto.onBegin( _fn_ )**
 
 add subscriber function to the onBegin event.
 
 * **beast.proto.onKill( _fn_ )**
 
 add subscriber function to the onKill event.
 
 * **beast.proto.onComplete( _fn_ )**
 
 add subscriber function to the onComplete event. 

 * **beast.proto.init( _fnopt_ )**
 
 begins animation loop and publishes onBegin.
 
 * **beast.proto.kill()** 
 
 stops animation loop and publishes onKill. 
 
 * **beast.proto.reinit()**  
 
 `kill` followed by `init`. Publishes onKill and onBegin.
 
 * **beast.proto.complete()**  
 
 stops animation loop and publishes onComplete.  
 
 * **beast.proto.st= _number_**
 
 property holds the state of a beast object `1` (_continue_), `2` (_sleep_), `3` (_killed_) or `4` (_completed_). definition of st affects the animation loop.

---------------------------------------------------------
#### <a id="plugins">plugins

 1. [*fade*](#plugin-fade)
 2. [*color*](#plugin-color)
 3. [*move*](#plugin-move)
 4. [*shape*](#plugin-shape)


 *ex*
 ``` javascript
 beast({ frames : 30 }).fade({ 
     classNameEnd : 'vis-hide',
     isclean : false,
     elem : elem, 
     ease : 'bgn',
     opend : 0
 }).init(); 
 ```

 Plugins provide an implementation and interface for animated actions. All provided plugins support these properties:

 * **elem= _documentElement_** _default: null_
   target element for the animation
   
 * **ease= _str_** _default: 'end'_
   slow the 'bgn' or 'end' of the animation
   
 * **isclean= _bool_** _default: true_   
   remove elem.style definitions made by beast when animation is finished?

 * **classNameEnd= _str_** _default: ''_
   className added to elem at end of animation


 Plugins are optimised. functions and data are cached where possible. Little error-handling is provided -given elements must exist in the document, numeric properties must be numeric, etc.    

 ClassNames are added/removed with [elemst][4]. As a result, all classNames added/removed with beast are prefixed with 'st-'. For example, classNameEnd 'box-shut' would be found in the className of an element as 'st-box-shut'.

  * <a href="#plugin-fade" id="plugin-fade">**plugin-fade**</a>

    *ex*
    ``` javascript
    beast({ frames : 30 }).fade({ 
        elem : elem, 
        ease : 'bgn',
        opend : 0
    }).init();
    ```

    * **opend= _num_**, _default: '100'_
      opacity end value, a number 0-100

    Starting opacity value is obtained from the element with the cascade being relevant. opacity is handled with [domopacity][5].

    _by default_, `isclean` removes 'opacity' styles at end of animation, recommendation is to use `classNameEnd` to preserve position.

  * <a href="#plugin-color" id="plugin-color">**plugin-color**</a>

    *ex*
    ``` javascript
    beast({ frames : 30 }).color({ 
        elem : elem, 
        ease : 'bgn' 
        bgnColor : '#aaf',
        endColor : '#aafaaf',
        endBackgroundColor : 'rgb("255", "255", "255")'
    }).init(); 
    ```

    * **bgnColor= _str_**, _default: elem current 'color'_
      elem start animation 'color'
   
    * **endColor= _str_**, _default: elem current 'color'_
      elem end animation 'color'   

    * **bgnBackgroundColor= _str_**, _default: elem current 'background-color'_
      elem start animation 'backround-color'   
   
    * **bgnBackgroundColor= _str_**, _default: elem current 'background-color'_
      elem start animation 'backround-color'      

    where color properties are undefined, existing color properties of elem are used. The 'a' in rgba is ignored, only non-transparent colors are animated. colors may be defined with hex code or rgba format. plugin uses browser-provided `getComputedStyle` -you will need a polyfill for it in some browser environments, such as IE8.

    _by default_, `isclean` removes 'color' and 'backgroundColor' styles at end of animation, recommendation is to use `classNameEnd` to preserve position.

  * <a href="#plugin-move" id="plugin-move">**plugin-move**</a>
  
    *ex*
    ``` javascript
    beast({ frames : 30 }).move({ 
        elem : elem, 
        ltend : [300, 200] 
    }).init(); 
    ```
    
    * **ltbgn= _numarr_**, _default: [elem current 'left', elem current 'top']_
      elem start animation [left, top]
   
    * **ltend= _numarr_**, _default: [elem current 'left', elem current 'top']_
      elem end animation [left, top]   
    
    _by default_, `isclean` removes 'top' and 'left' styles at end of animation, recommendation is to use `classNameEnd` to preserve position.

  * <a href="#plugin-shape" id="plugin-shape">**plugin-shape**</a>

    *ex*
    ``` javascript
    beast({ frames : 30 }).shape({ 
        elem : elem, 
        ease : 'bgn',
        whend : [300, 200]         
    }).init(); 
    ```
    * **whbgn= _numarr_**, _default: [elem current 'width', elem current 'height']_
      elem start animation [width, height]
   
    * **whend= _numarr_**, _default: [elem current 'width', elem current 'height']_
      elem end animation [width, height]
      
    _by default_, `isclean` removes 'width' and 'height' styles at end of animation, recommendation is to use `classNameEnd` to preserve shape.


[4]: https://github.com/iambumblehead/elemst                  "elemst"  
[5]: https://github.com/iambumblehead/domopacity          "domopacity" 

---------------------------------------------------------
#### <a id="thought">Thought:

Scripted animations, why? Not all browsers support styled animations. Not all animated effects are found with styled animations. Styled animations aren't flexible as scripted ones.

For tablets, phones and older IE browsers... in many use-cases beast performs with no observable 'choppiness'. If choppiness is experienced try more conservative frames and fps values.

---------------------------------------------------------
#### <a id="license">License:

 ![scrounge](http://github.com/iambumblehead/scroungejs/raw/master/img/hand.png) 

(The MIT License)

Copyright (c) 2013 [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
