package com.ncamp.pushit2thelimit.Kanban;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/kanban")
public class KanbanController {

    @Autowired
    private KanbanService service;

    @CrossOrigin(origins = "*")
    @GetMapping("/board")
    public Map<String, List<BacklogItem>> kanbanBoard() {

        Map<String, List<BacklogItem>> board = new HashMap<>();

        for (String s : service.getStates()) {
            board.put(s, new ArrayList<>());
        }

        for (BacklogItem b : service.getAllItems()) {
            List<BacklogItem> column = board.get(b.state);
            column.add(b);
        }

        return board;
    }
}
