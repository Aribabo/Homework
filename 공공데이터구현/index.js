let container = document.getElementById('map');
let options = {
    center: new kakao.maps.LatLng(36.3396728, 127.907950),
    level: 13
};
let map = new kakao.maps.Map(container, options);

const key = 'MFQhV%2FZRnUepzJxZ%2BHB1FIHAiJdEcnbf5n8u3Jc2UoLAbkogcZekWtdQyVAU7NeMGScZlxkyD%2BZfDvfLyp%2BEVA%3D%3D';

async function fetchData() {
    let allData = [];

    for (let page = 1; page <= 16; page++) {
        const link = `https://apis.data.go.kr/1741000/TemporaryHousingFacilityVictim3/getTemporaryHousingFacilityVictim1List?serviceKey=${key}&pageNo=${page}&numOfRows=1000&type=json`;

        const response = await fetch(link);
        const data = await response.json();

        // 데이터를 배열에 추가
        allData.push(...data.TemporaryHousingFacilityVictim[1].row);

        if (page === 16) {
            // 마지막 페이지에서 데이터 활용
            console.log(allData);

            // allData에서 중복을 제외한 ctprvn_nm 값을 추출하여 Set에 저장
            let uniqueCtprvnNmSet = new Set(allData.map(item => item.ctprvn_nm));

            // Set을 배열로 변환
            let uniqueCtprvnNmArray = [...uniqueCtprvnNmSet];

            console.log('Unique ctprvn_nm values:', uniqueCtprvnNmArray);

            // 다른 로직 실행
            handleCityClick(allData);
        }
    }
}



// ... 이전 코드 ...

function handleCityClick(dataArray) {
    let isDivVisible = false; // div가 보이는지 여부를 나타내는 변수
    let existingMarker = null; // 현재 지도에 표시된 마커를 저장하기 위한 변수
    let selectedCity = null; // 현재 선택된 도/시를 저장하기 위한 변수

    // 각 city를 클릭하는 이벤트 추가
    let menuItems = document.querySelectorAll('.menu p');
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            let city = item.textContent; // 클릭한 p 요소의 텍스트 값 가져오기

            // 같은 도/시를 두 번 클릭했을 때 div를 숨기고 리턴
            if (selectedCity === city) {
                let existingDiv = document.querySelector('.newDiv');
                if (existingDiv) {
                    existingDiv.parentNode.removeChild(existingDiv);
                    isDivVisible = false;
                }
                selectedCity = null;
                return;
            }

            // 기존의 div 제거
            let existingDiv = document.querySelector('.newDiv');
            if (existingDiv) {
                existingDiv.parentNode.removeChild(existingDiv);
            }

            // 새로운 div 생성
            let newDiv = document.createElement('div');
            newDiv.className = 'newDiv'; // 클래스 추가

            // 테이블 생성
            let table = document.createElement('table');
            table.style.borderCollapse = 'collapse'; // 셀 경계 모양을 합치기로 설정

            // 헤더 생성
            let headerRow = table.insertRow();
            let headerCell1 = headerRow.insertCell(0);
            let headerCell2 = headerRow.insertCell(1);
            let headerCell3 = headerRow.insertCell(2);
            headerCell1.style.border = '1px solid black'; // 테두리 추가
            headerCell2.style.border = '1px solid black'; // 테두리 추가
            headerCell3.style.border = '1px solid black'; // 테두리 추가
            headerCell1.innerHTML = '<b>이름</b>';
            headerCell2.innerHTML = '<b>수용인원</b>';
            headerCell3.innerHTML = '<b>주소</b>';

            // 데이터 추가
            dataArray
                .filter(data => data.ctprvn_nm === city)
                .forEach(data => {
                    let row = table.insertRow();
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    let cell3 = row.insertCell(2);
                    cell1.style.border = '1px solid black'; // 테두리 추가
                    cell2.style.border = '1px solid black'; // 테두리 추가
                    cell3.style.border = '1px solid black'; // 테두리 추가
                    cell1.innerHTML = data.vt_acmdfclty_nm;
                    cell2.innerHTML = data.vt_acmd_psbl_nmpr;
                    cell3.innerHTML = data.dtl_adres;

                    // 행을 클릭하면 지도에 마커를 표시하고 해당 위치로 이동
                    row.addEventListener('click', function () {
                        // 마커 생성
                        let markerPosition = new kakao.maps.LatLng(data.ycord, data.xcord);
                        let marker = new kakao.maps.Marker({
                            position: markerPosition,
                            map: map
                        });

                        // 현재 지도에 표시된 마커를 제거
                        if (existingMarker) {
                            existingMarker.setMap(null);
                        }

                        // 마커를 지도 중심에 위치시킴
                        map.setCenter(markerPosition);
                        // 확대 레벨 조정
                        map.setLevel(4);

                        // 현재 마커를 기존 마커로 설정
                        existingMarker = marker;
                    });
                });

            // div에 테이블 추가
            newDiv.appendChild(table);

            // 스크롤 추가
            newDiv.style.maxHeight = '80vh'; // 스크롤이 생길 최대 높이 (설정 가능)
            newDiv.style.overflowY = 'auto'; // 세로 스크롤을 허용

            // 새로운 div를 menu 다음에 추가
            let menu = document.querySelector('.menu');
            menu.parentNode.insertBefore(newDiv, menu.nextSibling);
            isDivVisible = true;
            selectedCity = city; // 현재 선택된 도/시 업데이트
        });
    });

    // ... 이후 코드 ...
}

// ... 나머지 코드 ...


let existingMarker; // 현재 지도에 표시된 마커를 저장하는 변수


fetchData();
