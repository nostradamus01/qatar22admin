const createCard = (match) => {
    return `
        <div class="card" id="${match.date.getTime()}">
            <p class="clock">${match.date.toLocaleString()}</p>
            <div class="group">
                <div class="goals">
                    <div class="country">                      
                        <img class="flag" src="../images/${match.t1.toUpperCase()}.png" alt="">
                        <p class="name">${match.t1.toUpperCase()}</p>
                    </div>
                    <div class="open">
                        <div class="goals-count not-expanded">
                        <span>${match.g1}</span>
                    </div>
                        <div class="open-numbers hidden" data-match="${match.matchId}" data-team="${1}"></div>
                    </div>            
                </div>
                <span class="line">-</span>
                <div class="goals">
                    <div class="open">
                        <div class="goals-count not-expanded">
                            <span>${match.g2}</span>
                        </div>
                        <div class="open-numbers hidden" data-match="${match.matchId}" data-team="${2}"></div> 
                    </div>
                    <div class="country">                        
                        <img class="flag" src="../images/${match.t2.toUpperCase()}.png" alt="">
                        <p class="name">${match.t2.toUpperCase()}</p>
                    </div>
                </div>    
            </div>  
        </div>
    `;
}

const toggleElClass = (element, class1, class2) => {
    if (element.classList.contains(class1)) {
        element.classList.remove(class1);
        element.classList.add(class2);
    } else if (element.classList.contains(class2)) {
        element.classList.remove(class2);
        element.classList.add(class1);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const loaderCmp = document.querySelector('.loader');

    const mainContainer = document.querySelector('main.main');

    const allData = await (await sendPostRequest(createUrl('/getAllData'), {})).json();
    const { allMatches, allResults } = allData;
    const matches = [];
    allResults.forEach((result) => {
        const match = allMatches.find(match => match.matchId === result.matchId);
        match.g1 = result.g1;
        match.g2 = result.g2;
        match.date = new Date(match.date);
        matches.push(match);
        mainContainer.insertAdjacentHTML('beforeend', createCard(match));
    });

    const goalsCount = document.querySelectorAll('.goals-count');
    const box = document.querySelectorAll('.open-numbers');
    for (let i = 0; i < goalsCount.length; i++) {
        let matchNum = box[i].getAttribute('data-match');
        let teamNum = box[i].getAttribute('data-team');
        if (!allMatches[(+matchNum)-1].unchangeable) {
            goalsCount[i].addEventListener('click', () => {
                let openedNumbers = document.querySelector('.open-numbers.not-hidden');
                if (openedNumbers && openedNumbers !== box[i]) {
                    toggleElClass(openedNumbers, 'hidden', 'not-hidden');
                }
                toggleElClass(box[i], 'hidden', 'not-hidden');
                let expandedGoals = document.querySelector('.goals-count.expanded');
                if (expandedGoals && expandedGoals !== goalsCount[i]) {
                    toggleElClass(expandedGoals, 'expanded', 'not-expanded');
                }
                toggleElClass(goalsCount[i], 'expanded', 'not-expanded');
            });

            for (let j = 0; j < 10; j++) {
                box[i].insertAdjacentHTML('beforeend', `
                    <div class="goal-count" data-goal="${j}">
                        <span>${j}</span>
                    </div>
                `);
            }

            const goals = box[i].querySelectorAll('.goal-count');
            goals.forEach(goal => {
                if (!allMatches[(+matchNum)-1].unchangeable) {
                    goal.addEventListener('click', async (e) => {
                        if (!allMatches[(+matchNum)-1].unchangeable) {
                            console.log(e.target);
                            const goalCount = +goal.getAttribute('data-goal');
                            goalsCount[i].innerHTML = `<span>${goalCount}</span>`;
                            toggleElClass(box[i], 'hidden', 'not-hidden');
                            toggleElClass(goalsCount[i], 'expanded', 'not-expanded');
                            const obj = {
                                matchId: +matchNum
                            }
                            obj[`g${teamNum}`] = goalCount;
                            await sendPostRequest(createUrl('/setResult'), obj);
                        }
                    });
                }
            });
        }
    };
    
    const menuBtn = document.querySelector('.menu-hamburger');
    menuBtn.addEventListener('click',()=>{
        const menu = document.querySelector('.menu');
        menu.classList.toggle('show')
    })

    let timeNow = new Date();
    timeNow = timeNow.getTime();
    const cards = document.querySelectorAll('.card');
    let cardsLenght = cards.length;
    let currentMatchCard = cards[cards.length - 1];
    for (let i = 0; i < cardsLenght; i++) {
        if (timeNow < +cards[i].id) {
            currentMatchCard = cards[i - 2];
            break;
        }
    }
    currentMatchCard.scrollIntoView();
    stopLoader(loaderCmp);
});