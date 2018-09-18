package com.ncamp.pushit2thelimit.Kanban;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
class BacklogItem {
    String id;
    String title;
    String state;
}
