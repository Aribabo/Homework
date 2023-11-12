let container = document.getElementById('map');
let options = {
    center: new kakao.maps.LatLng(36.3396728, 127.907950),
    level: 13
};
let map = new kakao.maps.Map(container, options);

const key = 'MFQhV%2FZRnUepzJxZ%2BHB1FIHAiJdEcnbf5n8u3Jc2UoLAbkogcZekWtdQyVAU7NeMGScZlxkyD%2BZfDvfLyp%2BEVA%3D%3D';

async function fetchData() {
    // allData에 모든 데이터 입력
    let allData = [];
    let locationNameArr = []
    // 총 데이터건수 
    for (let page = 1; page <= 16; page++) {
        const link = `https://apis.data.go.kr/1741000/TemporaryHousingFacilityVictim3/getTemporaryHousingFacilityVictim1List?serviceKey=${key}&pageNo=${page}&numOfRows=1000&type=json`;

        const response = await fetch(link);
        const data = await response.json();

        // 데이터를 배열에 추가, ...을 사용하여 배열이 아닌 객체로 삽입
        allData.push(...data.TemporaryHousingFacilityVictim[1].row);

        if (page % 2 == 0) { //데이터 양이 많아 로딩에 시간이 걸림으로 조금씩 불러올때마다 표현해줌
            // 마지막 페이지에서 데이터 활용
            console.log(`${allData.length}`);
            // allData에서 중복을 제외한 ctprvn_nm 값을 추출하여 Set에 저장
            let uniqueCtprvnNmSet = new Set(allData.map(item => item.ctprvn_nm));
            if (page === 16) {
                // Set을 배열로 변환
                locationNameArr = [...uniqueCtprvnNmSet];
                console.log('로딩 완료')
                console.log('Unique ctprvn_nm values:', locationNameArr);
            }
            // 다른 로직 실행
            handleCityClick(allData);
        }
    }
}
let existingMarker = null; // 현재 지도에 표시된 마커를 저장하기 위한 변수, 초기화면으로 돌아가기 위해서 전역변수로 생성
// 도시클릭시 발생하는 이벤트
function handleCityClick(dataArray) {
    let selectedCity = null; // 현재 선택된 지역을 저장하기 위한 변수
    let selectedRow = null; // 현재 선택된 행을 저장하기 위한 변수

    // 각 city를 클릭하는 이벤트 추가
    // class menu의 p태그 선택()
    let menuItems = document.querySelectorAll('.menu p');
    // menuItems은 객체일테니 이벤트 리스너를 forEach문으로 돌리기
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            let city = item.textContent; // 클릭한 p 요소의 텍스트 값 가져오기

            // 이전에 선택한 행의 배경색을 제거
            if (selectedRow) {
                selectedRow.style.backgroundColor = '';
            }

            // 같은 지역을 두 번 클릭했을 때 div를 숨기고 리턴
            if (selectedCity === city) {
                let existingDiv = document.querySelector('.newDiv');
                if (existingDiv) {
                    existingDiv.parentNode.removeChild(existingDiv);
                    selectedCity = null;
                    selectedRow = null;

                    // 지도 초기 위치로 이동
                    map.setLevel(13);
                    map.setCenter(new kakao.maps.LatLng(36.3396728, 127.907950));
                    // 이전 마커 제거
                    if (existingMarker) {
                        existingMarker.setMap(null);
                        existingMarker = null;
                    }
                    
                }
                return; // 같은 지역 두번 클릭시 여기서 코드 종료
            }

            // 다른 지역을 클릭할 경우 기존의 div 제거
            // 이미 테이블이 생겼을 경우에만 .newDiv가 존재할테니 
            let existingDiv = document.querySelector('.newDiv');
            if (existingDiv) {
                existingDiv.parentNode.removeChild(existingDiv);
            }

            // 피난처 목록을 위한 새로운 div 생성
            let newDiv = document.createElement('div');
            newDiv.className = 'newDiv'; // 클래스 추가

            // 테이블 생성
            let table = document.createElement('table');
            // 테이블 스타일 설정 - 셀 경계 모양을 합치기로 설정
            table.style.borderCollapse = 'collapse';

            // 헤더 생성 
            let headerRow = table.insertRow();
            let headerCell1 = headerRow.insertCell(0);
            let headerCell2 = headerRow.insertCell(1);
            let headerCell3 = headerRow.insertCell(2);
            headerCell1.style.border = '1px solid black';
            headerCell2.style.border = '1px solid black';
            headerCell3.style.border = '1px solid black';
            headerCell1.innerHTML = '<b>이름</b>';
            headerCell2.innerHTML = '<b>수용인원</b>';
            headerCell3.innerHTML = '<b>주소</b>';
            headerRow.style.backgroundColor = 'lightgray'

            // 데이터 추가
            dataArray
                // 원하는 지역의 데이터만 추출
                .filter(data => data.ctprvn_nm === city)
                .forEach(data => {
                    // 각 데이터마다 테이블에 행 추가
                    let row = table.insertRow(); // 행추가
                    let cell1 = row.insertCell(0); // 첫번째 칸
                    let cell2 = row.insertCell(1); // 두번째 칸
                    let cell3 = row.insertCell(2); // 세번째 칸
                    cell1.style.border = '1px solid black'; // 테두리 추가
                    cell2.style.border = '1px solid black'; // 테두리 추가
                    cell3.style.border = '1px solid black'; // 테두리 추가
                    cell1.innerHTML = data.vt_acmdfclty_nm;
                    cell2.innerHTML = data.vt_acmd_psbl_nmpr;
                    cell3.innerHTML = data.dtl_adres;

                    // 행을 클릭하면 지도에 마커를 표시하고 해당 위치로 이동하도록 행마다 이벤트리스너 생성
                    row.addEventListener('click', function () {
                        // 이전에 선택한 행의 배경색을 흰색으로 변경
                        if (selectedRow) {
                            selectedRow.style.backgroundColor = 'white';
                        }
                        // 현재 선택한 행의 배경색을 변경
                        row.style.backgroundColor = 'lightblue';
                        selectedRow = row;

                        // 마커 생성
                        let markerPosition = new kakao.maps.LatLng(data.ycord, data.xcord);
                        // 현재위치를 기준으로 마커생성
                        let marker = new kakao.maps.Marker({
                            position: markerPosition,
                            map: map
                        });

                        // 현재 지도에 표시된 마커를 제거
                        if (existingMarker) {
                            existingMarker.setMap(null);
                        }
                        // 현재 마커를 기존 마커로 설정
                        existingMarker = marker;
                        // 확대 레벨 조정
                        map.setLevel(2);
                        // 마커를 지도 중심에 위치시킴
                        map.setCenter(markerPosition);
                    });
                });

            // div에 테이블 추가
            newDiv.appendChild(table);

            // 스크롤 추가
            newDiv.style.width = '20%'
            newDiv.style.marginRight = '20px'
            newDiv.style.maxHeight = '80vh'; 
            newDiv.style.overflowY = 'auto'; // 세로 스크롤을 허용

            // 새로운 div를 menu 다음에 추가
            let menu = document.querySelector('.menu');
            menu.parentNode.insertBefore(newDiv, menu.nextSibling);
            selectedCity = city; // 현재 선택된 도/시 업데이트
        });
    });
}

fetchData();
