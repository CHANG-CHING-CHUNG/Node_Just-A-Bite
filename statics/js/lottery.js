/* eslint-disable no-alert */
document.addEventListener('DOMContentLoaded', () => {
  displayPrize();
  const text = document.querySelector('.text');
  const backgroundImg = document.querySelector('.lottery');

  function getPrize(cb) {
    fetch('https://dvwhnbka7d.execute-api.us-east-1.amazonaws.com/default/lottery').then((res) => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res;
    }).then(data => data.json()).then((data) => {
      cb(data);
    })
      .catch((err) => {
        cb(null, err);
      });
  }

  function displayPrize() {
    getPrize((data, err) => {
      if (err || data.prize === undefined) {
        alert('系統不穩定，請再試一次。');
        return;
      }
      switch (data.prize) {
        case 'FIRST':
          text.textContent = '恭喜你中頭獎了！日本東京來回雙人遊！';
          backgroundImg.classList.add('first');
          backgroundImg.classList.remove('second');
          backgroundImg.classList.remove('third');
          backgroundImg.classList.remove('none');
          break;
        case 'SECOND':
          text.textContent = '二獎！90 吋電視一台！';
          backgroundImg.classList.add('second');
          backgroundImg.classList.remove('first');
          backgroundImg.classList.remove('third');
          backgroundImg.classList.remove('none');
          break;
        case 'THIRD':
          text.textContent = '恭喜你抽中三獎：知名 YouTuber 簽名握手會入場券一張，bang！';
          backgroundImg.classList.add('third');
          backgroundImg.classList.remove('second');
          backgroundImg.classList.remove('first');
          backgroundImg.classList.remove('none');
          break;
        case 'NONE':
          text.textContent = '銘謝惠顧';
          backgroundImg.classList.add('none');
          backgroundImg.classList.remove('second');
          backgroundImg.classList.remove('third');
          backgroundImg.classList.remove('first');
          break;
        default:
          console.log('Some errors happended');
      }
    });
  }
});
