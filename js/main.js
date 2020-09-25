(() => {
  const hand = document.querySelector('.hand');
  const leaflet = document.querySelector('.leaflet');
  const pageElems = document.querySelectorAll('.page'); // 시간차를 두고 카드를 닫기 위해서
  let pageCount = 0; // 카드가 다열릴때를 판단하기 위해 --> close 버튼을 보이게 하기 위해
  let currentMenu; // 현재 클릭한 메뉴아이템을 넣는 변수

  const handPos = { x: 0, y: 0 }; // 현재 손의 위치
  const targetPos = { x: 0, y: 0 }; // 마우스 위치
  let distX; // 마우스와 손의 x거리
  let distY; // 마우스와 손의 y거리

  function getTarget(elem, className) {
    while (!elem.classList.contains(className)) {
      elem = elem.parentNode;

      if (elem.nodeName == 'BODY') {
        elem = null;
        return;
      }
    }

    return elem;
  }

  function closeLeaflet() {
    pageCount = 0;
    document.body.classList.remove('leaflet-opened');
    pageElems[2].classList.remove('page-flipped');
    setTimeout(() => {
      pageElems[0].classList.remove('page-flipped');
    }, 500);
  }

  function zoomIn(elem) {
    const rect = elem.getBoundingClientRect(); // 클릭한 것의 위치정보를 가져오는 함수
    const dx = window.innerWidth / 2 - (rect.x + rect.width / 2); // 클릭한 것을 가운데로 가져오기 위해
    const dy = window.innerHeight / 2 - (rect.y + rect.height / 2); // 클릭한 것을 가운데로 가져오기 위해
    let angle;

    switch (
      elem.parentNode.parentNode.parentNode.dataset.page * 1 // * 1 은 문자열을 숫자로 바꿔줌
    ) {
      case 1:
        angle = -30; // 첫번째 카드를 클릭할 경우, -30도를 해준다.
        break;
      case 2:
        angle = 0;
        break;
      case 3:
        angle = 30;
        break;
    }

    document.body.classList.add('zoom-in'); // 줌인상태를 알리기위해, body에 zoom-in붙이기
    leaflet.style.transform = `translate3d(${dx}px, ${dy}px, 50vw) rotateY(${angle}deg)`; // 50vw가 줌인효과를 줌 , rotateY로 각도를 더해줘서 카드를 평평하게 해줌
    currentMenu = elem;
    currentMenu.classList.add('current-menu'); // 현재 클릭한 메뉴만 확대되서 보이고, 나머지 메뉴들은 안보이게 하는 클래스
  }

  function zoomOut() {
    leaflet.style.transform = 'translate3d(0, 0, 0)';
    if (currentMenu) {
      document.body.classList.remove('zoom-in');
      currentMenu.classList.remove('current-menu');
      currentMenu = null;
    }
  }

  //이미지를 부드럽게 따라오게 하기위한 방법
  function render() {
    distX = targetPos.x - handPos.x;
    distY = targetPos.y - handPos.y;
    handPos.x = handPos.x + distX * 0.1;
    handPos.y = handPos.y + distY * 0.1;
    hand.style.transform = `translate(${handPos.x - 60}px, ${handPos.y + 30}px)`; // -60 , +30 은 이미지랑 마우스 위치를 조정하기 위해서 추가
    requestAnimationFrame(render);
  }

  render();

  leaflet.addEventListener('click', (e) => {
    let pageElem = getTarget(e.target, 'page');
    if (pageElem) {
      pageElem.classList.add('page-flipped'); // page-flipped가 붙었을 때, 카드가 넘어가는 효과를 나타내줌
      pageCount++;

      if (pageCount == 2) {
        document.body.classList.add('leaflet-opened'); // 카드가 다 열렸을때, close버튼을 보이게 하기 위해
      }
    }

    let closeBtnElem = getTarget(e.target, 'close-btn');
    if (closeBtnElem) {
      closeLeaflet();
      zoomOut();
    }

    let menuItemElem = getTarget(e.target, 'menu-item');
    if (menuItemElem) {
      zoomIn(menuItemElem);
    }

    let backBtn = getTarget(e.target, 'back-btn');
    if (backBtn) {
      zoomOut();
    }
  });

  leaflet.addEventListener('animationend', () => {
    // start-ani 에니메이션을 추가해주어서 그 다음 줌인 줌아웃등의 translate가 충돌이 나서, animationend를 이용해서 animation이 끝는 후에 에니메이션의 지워준다
    leaflet.style.animation = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    // 마우스 이동
    targetPos.x = e.clientX - window.innerWidth * 0.7; // 처음 마우스 위치를 정해줬기 때문에 그 차이를 줄여주기 위해서 - window.innerWidth * 0.7 함
    targetPos.y = e.clientY - window.innerHeight * 0.7; // 처음 마우스 위치를 정해줬기 때문에 그 차이를 줄여주기 위해서 - window.innerHeight * 0.7 함
  });
})();
