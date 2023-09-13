'use strict';

class Display {

	draw() {
		let turn = screen%20;
		let pass = Math.floor(screen / 20);

		context.clearRect(0, 0, 1500, 1000);

        context.font = "24px sans-serif";
        if (pass == 0 || pass == 7) {
        	context.fillText((turn+1)+" / 4組目 ", 0, 128*3+24);;
        }
        else{
        	context.fillText("条件を考えてください " +(turn+1)+" / 4組目 ", 0, 128*3+24);
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



	    let i = all_data[pass][1][turn] - 1;
	    let tl_limit = 1700;

	    //tl 1条件目と8条件目は0.5秒の赤枠表示
	    if (pass == 0 || pass == 7) {
	    	tl_limit = 1300;
	    }

	    setTimeout(function(){
    	context.strokeStyle = "red";
        context.lineWidth = 6;
        context.strokeRect(i%3*imgsize, Math.floor(i/3)*imgsize, imgsize, imgsize);
    	}, tl_limit);

	    canvas.addEventListener('click', this.onClick, false);
	}

}