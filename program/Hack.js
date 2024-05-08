'use strict';

class Hack {

    draw() {
        let turn = screen%20;
        let pass = Math.floor(screen / 20);

        context.clearRect(0, 0, 1500, 1000);

        context.font = "48px sans-serif";

        if (turn+1 <= 4) {
            context.fillText("正規 " + (turn+1)+" / 4組目 ", 0, imgsize*3+48);
        }
        else{
            context.fillText("非正規 " + (turn-3)+" / 8組目 ", 0, imgsize*3+48);
        }

        context.fillText((pass+1)+" / 4セット ", 0, imgsize*3+48*2);

        context.fillText("パスワード番号 : " +(rand[pass]),0, imgsize*3+48*3);

        //画像描画
        let img = new Image();

        img.src = './new_images/'+(rand[pass])+"/auth_"+(turn)+".png";
        
        img.onload = function(){
            context.drawImage(img, 0, 0, imgsize*3, imgsize*3);}

        if (turn+1 == 5) {
            window.setTimeout(function(){alert("非正規認証者に交代してください");}, 100);
        }

        canvas.addEventListener('click', this.onClick, false);
    }

}