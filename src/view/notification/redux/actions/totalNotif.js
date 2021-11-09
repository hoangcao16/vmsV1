import { TOTAL_NOTIF } from '../constants';

const setTotalNotif = (total) => ({
  type: TOTAL_NOTIF.LOAD_SUCCESS,
  total
});

export { setTotalNotif };
