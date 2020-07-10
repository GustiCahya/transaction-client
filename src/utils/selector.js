const $ = (target) => {
    const elems = document.querySelectorAll(target);
    return (elems.length > 1) ? elems : document.querySelector(target);
}

export default $;