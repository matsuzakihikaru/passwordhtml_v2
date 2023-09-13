'use strict';

class Hack {

	draw() {
		let turn = screen%20;//turnは4以上
		let pass = Math.floor(screen / 20);

		context.clearRect(0, 0, 1500, 1000);

        context.font = "24px sans-serif";
        if (pass == 0 || pass == 7) {
        	context.fillText("表示されている条件を満たす画像をクリックしてください " +(turn-3)+" / 8組目 ", 0, 128*3+24);
        }
        else{
        	context.fillText("推測した条件を満たす画像をクリックしてください " +(turn-3)+" / 8組目 ", 0, 128*3+24);
        }

        context.fillText((pass+1)+" / 14 セット ", 0, 128*3+48);

        if (pass==0) {
        	context.fillText("条件は「前髪で額が隠れている人」です。", 0, 128*3+72);
        }
        if (pass==7) {
        	context.fillText("条件は「髪がパーマの人」です。", 0, 128*3+72);
        }        

		//画像描画
        let img = new Image();
        if (pass == 0) {
        	img.src = './new_images/'+13+"/"+(turn+1)+".png";
        }
        else if (pass < 7) {
        	img.src = './new_images/'+(rand[pass-1]+1)+"/"+(turn+1)+".png";
        }
        else if (pass == 7) {
        	img.src = './new_images/'+14+"/"+(turn+1)+".png";
        }
        else {
        	img.src = './new_images/'+(rand[pass-2]+1)+"/"+(turn+1)+".png";
        }

        img.onload = function(){
            context.drawImage(img, 0, 0, imgsize*3, imgsize*3);}

	    canvas.addEventListener('click', this.onClick, false);
	}

}