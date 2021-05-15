const init = (sectionClassName, linkClassName) => {
    const sections = document.getElementsByClassName(sectionClassName);
    const container = sections[0].parentNode;

    container.style['overflow-y'] = 'hidden';

    const scrollData = {
        current: 0,
        sections,
        container
    }

    setupTouchEvents(scrollData);

    if(linkClassName) setupLinks(linkClassName, scrollData);

    document.addEventListener('wheel', debounce(e => handleScroll(e, scrollData)));

    setTimeout(() => {
        window.scrollTo(0, 0)
    }, 100);
}

const debounce = (func, timeout = 100) => {
    let timer;

    return (...args) => {
        if(!timer) func.apply(this, args);

        clearTimeout(timer);

        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    };
}

const handleScroll = (e, scrollData) => {
    let { current } = scrollData;
    const { sections, container } = scrollData;

    const initial = current;
    const { deltaY } = e;

    if(deltaY < 0 && current - 1 >= 0) current -= 1;
    else if(deltaY > 0 && current + 1 < sections.length) current += 1;

    if(initial !== current){
        scrollData.current = current;
        
        animate({
            dest: sections[current],
            initial: sections[initial]
        }, container);

        sections[0].focus();
    }
}

const setupTouchEvents = scrollData => {
    let initialY, isMoving;

    document.addEventListener('touchstart', e => {
        initialY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', _e => isMoving = true);

    document.addEventListener('touchend', e => {
        if(isMoving){
            const { clientY } = e.changedTouches[0];
            isMoving = false;
       
            const directionDelta = initialY < clientY ? -1 : 1;
            handleScroll({ deltaY: directionDelta }, scrollData);
        }
    });
}

const setupLinks = (className, scrollData) => {
    const links = document.getElementsByClassName(className);
    const { sections } = scrollData;

    for(const link of links){
        link.addEventListener('click', () => {
            let parent = link.parentElement;

            while(parent && parent.className !== 'scroll-section'){
                parent = parent.parentElement;
            }

            const { hash } = link.dataset;
            const destination = [...sections].findIndex(elem => elem.id === hash);

            scrollData.current = destination;
            
            animate({
                initial: parent,
                dest: sections[destination]
            }, document.body);
        });
    }
}

const animate = (position, container) => {
    const { dest, initial } = position;
    const destPosition = (dest.offsetTop - window.scrollY) * (-1);

    const keyframes = [
        { transform: `translateY(${ (initial.offsetTop - window.scrollY) * (-1) }px)` },
        { transform: `translateY(${ destPosition }px)` }
    ];

    const options = {
        duration: 800,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
    }

    const animation = container.animate(keyframes, options);
    container.style.transform = `translateY(${ destPosition }px)`;

    return animation
}

const smoothScroll = { init }