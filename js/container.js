(function ($) {
    'use strict';
    var $window = $(window),
        $html = $('html');
    $(function () {
        //gunami pf start -----------------------------------------------------------------------------------

        //wheel animation start
        window.addEventListener("wheel", function(e) {
            if(e.deltaY == 100){

            }
            else if(e.deltaY == -100){

            }
        });
        var WrapperB = $("#wrapper").offset().top + $("#wrapper").height();
        $window.on('scroll', function(){
            var $this = $(this),
                WST = $this.scrollTop();
            if(WST > 0 && WST < WrapperB){
                $html.addClass("wheel_start");
            }
            else if(WST == 0){
                $html.removeClass("wheel_start");
            }
        });
        //wheel animation end

        //gsap animation start
        gsap.registerPlugin(ScrollTrigger);
        var skewYZero = {skewY:0},
            transYZero = {translateY:0};
        var skewYLinkItem = gsap.quickSetter(".link_item", "skewY", "deg"),
            transYPofolItem = gsap.quickSetter(".pofol_item", "translateY", "px");
        var clampSkewY = gsap.utils.clamp(-25, 25),
            clampTransY = gsap.utils.clamp(-100, 100);
        ScrollTrigger.create({
            onUpdate : (self) => {
                var wheelSkewY = clampSkewY(self.getVelocity() / 200);
                if(Math.abs(wheelSkewY) > Math.abs(skewYZero.skewY)) {
                    skewYZero.skewY = wheelSkewY;
                    gsap.to(skewYZero, {
                        skewY : 0,
                        duration : 1.5,
                        ease : "Circ.easeOut",
                        overwrite : true,
                        onUpdate : () => skewYLinkItem(skewYZero.skewY)
                    });
                }
                var wheelTransY = clampTransY(self.getVelocity() / -10);
                if(Math.abs(wheelTransY) > Math.abs(transYZero.translateY)){
                    transYZero.translateY = wheelTransY;
                    gsap.to(transYZero, {
                        translateY : 0,
                        duration : 0.5,
                        ease : "back.inOut(1.7)",
                        overwrite : true,
                        onUpdate : () => transYPofolItem(transYZero.translateY)
                    });
                }
            }
        });  //ScrollTrigger end
        gsap.set(".link_item[data-link-type='1']", {transformOrigin:"left bottom", force3D:true});
        gsap.set(".link_item[data-link-type='2']", {transformOrigin:"center center", force3D:true});
        gsap.set(".link_item[data-link-type='3']", {transformOrigin:"right bottom", force3D:true});
        //gsap animation end

        //mouse move text animation start
        function mouseDecoText(e){
            var SlowSkew = -(e.pageX - ($window.width() / 2)) * 0.05;
            gsap.to(".deco_text", {
                duration : 0.5,
                ease : "power4",
                skewX : SlowSkew
            });
        }
        function mouseDecoInner(e){
            var SlowTrans = (e.pageX - ($window.width() / 2)) * 2;
            gsap.to(".deco_inner", {
                duration : 1,
                delay : 0.2,
                ease : "power4",
                translateX : -SlowTrans
            });
        }
        document.addEventListener("mousemove", mouseDecoText);
        document.addEventListener("mousemove", mouseDecoInner);
        //mouse move text animation end

        //gunami pf end -----------------------------------------------------------------------------------
    });
})(jQuery);