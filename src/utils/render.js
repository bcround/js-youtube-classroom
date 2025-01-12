import {
  getNotFoundTemplate,
  getSkeletonTemplate,
  getYoutubeItemsTemplate,
  getChipTemplate,
  getNoResultTemplate,
} from './htmlTemplate';
import { iterate } from './iterate';
import globalState from './globalState';

const $chips = document.querySelector('.chips');
const $snackBar = document.getElementById('snackBar');
let renderedSkeletons = [];

export const renderYoutubeItems = (item, youtubeState) => {
  const { node, youtubeItemType, isSaved } = youtubeState;
  const $article = document.createElement('article');

  $article.classList.add('clip');
  $article.innerHTML = getYoutubeItemsTemplate(item, isSaved, youtubeItemType);
  node.appendChild($article);
};

export const renderNotFoundMessage = node => {
  node.innerHTML = getNotFoundTemplate();
};

export const renderSkeleton = (node, numOfSkeletons) => {
  Array.from({ length: numOfSkeletons }, (_, i) => i).forEach(() => {
    const $div = document.createElement('div');
    $div.classList.add('skeleton');
    $div.innerHTML = getSkeletonTemplate();
    renderedSkeletons = [...renderedSkeletons, node.appendChild($div)];
  });
};

export const hideSkeleton = node => {
  renderedSkeletons.forEach(skeleton => {
    node.removeChild(skeleton);
  });
  renderedSkeletons = [];
};

export const refreshItems = node => {
  node.innerHTML = null;
};

export const renderChips = chips => {
  if (!chips) return;

  $chips.innerHTML = getChipTemplate(chips);
};

export const renderNoResult = node => {
  node.innerHTML = getNoResultTemplate();
};

export const renderSnackBar = message => {
  $snackBar.innerText = message;
  $snackBar.classList.toggle('show');
  setTimeout(() => {
    $snackBar.classList.toggle('show');
  }, 3000);
};

export const renderNotWatchedItems = (items, node) => {
  const notWatchedItems = items.filter(item => {
    const {
      state: { isWatched },
    } = item;

    return !isWatched;
  });
  iterate(renderYoutubeItems, notWatchedItems, {
    node,
    youtubeItemType: 'lecture',
  });
};

export const renderWatchedItems = (items, node) => {
  const watchedItems = items.filter(item => {
    const {
      state: { isWatched },
    } = item;

    return isWatched;
  });
  iterate(renderYoutubeItems, watchedItems, {
    node,
    youtubeItemType: 'lecture',
  });
};

export const renderLikedItems = (items, node) => {
  const likedItems = items.filter(item => {
    const {
      state: { isLiked },
    } = item;

    return isLiked;
  });
  iterate(renderYoutubeItems, likedItems, {
    node,
    youtubeItemType: 'lecture',
  });
};

export const renderDependsOnTabState = (items, node, cb) => {
  if (globalState.tabState === 'notWatched') {
    refreshItems(node);
    renderNotWatchedItems(items, node);
    cb && cb('본 영상으로 체크되었습니다.');
  } else if (globalState.tabState === 'watched') {
    refreshItems(node);
    renderWatchedItems(items, node);
    cb && cb('나중에 볼 영상으로 체크되었습니다.');
  } else {
    refreshItems(node);
    renderLikedItems(items, node);
  }
};
