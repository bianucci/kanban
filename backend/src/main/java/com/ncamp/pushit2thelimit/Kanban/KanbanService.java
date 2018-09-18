package com.ncamp.pushit2thelimit.Kanban;

import org.springframework.stereotype.Service;
import reactor.core.publisher.EmitterProcessor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
class KanbanService {

    private static Set<BacklogItem> backlog = new HashSet<>();

    private EmitterProcessor<BacklogItem> topicData = EmitterProcessor.create();
    private FluxSink<BacklogItem> sink;

    void saveItem(BacklogItem b) {
        backlog.add(b);
        if (sink == null) {
            sink = topicData.sink();
        }
        sink.next(b);
    }

    Set<BacklogItem> getAllItems() {
        return backlog;
    }

    Flux<BacklogItem> getItemStream() {
        return topicData.publish().autoConnect();
    }

    List<String> getStates() {
        return Arrays.asList("A", "B", "C");
    }

    public void remove(BacklogItem item) {
        backlog.remove(item);
        if (sink == null) {
            sink = topicData.sink();
        }
        item.state = null;
        sink.next(item);
    }
}
