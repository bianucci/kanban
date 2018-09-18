import axios from 'axios';

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

  subscibeToUpdates(cb) {
    var source = new EventSource("http://localhost:8090/backlog/update");
    source.onmessage = function(event) {
      cb(JSON.parse(event.data));
    };
  }
}

export default new Service();