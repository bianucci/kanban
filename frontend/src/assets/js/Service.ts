import axios from 'axios';
import { initEventSource } from './ESPlugin';

const updateService = new EventSource("http://localhost:8090/backlog/update");
export const updateServiceEvent = initEventSource(updateService, 'json');

class Service {

  kanbanURL = 'http://localhost:8090/kanban/board';
  backlogURL = 'http://localhost:8090/backlog';
  
  fetchBoard() {
    return axios.get(this.kanbanURL);
  }

  saveItem(item) {
    return axios.post(this.backlogURL, item);
  }

  deleteItem(item) {
    return axios.delete(this.backlogURL, {
      data: item
    })
  }

  subscribeToUpdates(cb) {
    if (!cb) {
      return;
    }

    const source = new EventSource("http://localhost:8090/backlog/update");
    source.onmessage = (event) => {
      const update = JSON.parse(event.data);
      cb(update);

      console.log(event, update);
    };
  }
}

export default new Service();