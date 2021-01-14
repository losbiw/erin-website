const init = (sectionClassName, linkClassName) => {
    const sections = document.getElementsByClassName(sectionClassName);
    const container = sections[0].parentNode;

    container.style['overflow-y'] = 'hidden';

    const scrollData = {
        current: initCurrent(sections),
        isLocked: false,
        sections,
        container
    }

    setupTouchEvents(scrollData);
    if(linkClassName) setupLinks(linkClassName, scrollData);
    document.addEventListener('wheel', e => handleScroll(e, scrollData));
}

const handleScroll = (e, scrollData) => {
    let { isLocked, current } = scrollData;
    const { sections, container } = scrollData;

    if(!isLocked){
        const initial = current;
        const { deltaY } = e;
    
        if(deltaY < 0 && current - 1 >= 0) current -= 1;
        else if(deltaY > 0 && current + 1 < sections.length) current += 1;
    
        if(initial !== current){
            scrollData.isLocked = true;
            scrollData.current = current;
            
            const animation = animate({
                dest: sections[current],
                initial: sections[initial]
            }, container);

            animation.onfinish = () => scrollData.isLocked = false;
        }  
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

const initCurrent = elements => {
    for(const index in elements){
        const { offsetTop, scrollHeight } = elements[index];
        const { scrollY } = window;

        if(offsetTop <= scrollY && scrollHeight + offsetTop > scrollY){
            return parseInt(index)
        }
    }
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