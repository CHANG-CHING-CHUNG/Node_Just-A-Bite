
function init() {
  const faqLists = Array.from(document.getElementsByClassName('questions'));
  faqLists.forEach((list) => {
    const height = list.lastElementChild.scrollHeight;
    const titleHeight = list.previousElementSibling.scrollHeight;
    let toggle = false;
    list.addEventListener('click', () => {
      // eslint-disable-next-line prefer-const
      if (toggle === false) {
        toggle = true;
        list.parentElement.setAttribute('style', `height: ${height + 50}px`);
      } else if (toggle === true) {
        toggle = false;
        list.parentElement.setAttribute('style', `height: ${titleHeight}px`);
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', init);
