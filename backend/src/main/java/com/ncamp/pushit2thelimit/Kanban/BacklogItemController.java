package com.ncamp.pushit2thelimit.Kanban;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.Set;

@RestController
@RequestMapping("/backlog")
public class BacklogItemController {

    @Autowired
    private KanbanService service;

    @CrossOrigin(origins = "*")
    @GetMapping
    public Set<BacklogItem> getAll() {
        return service.getAllItems();
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/update")
    public Flux<BacklogItem> backlogEvents(){
        return service.getItemStream();
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/fake")
    public void addFake(){
        service.saveItem(new BacklogItem("id", System.currentTimeMillis() + "", "A"));
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping
    public void remove(@RequestBody BacklogItem item) {
        service.remove(item);
    }

    @CrossOrigin(origins = "*")
    @PostMapping
    public void save(@RequestBody BacklogItem item) {
        service.saveItem(item);
    }

}
