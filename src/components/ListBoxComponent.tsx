import { useState } from "react";
import WordBarComponent from "./WordBarComponent";
import { Plus, Menu } from "lucide-react";
import { ReactSortable } from "react-sortablejs";
import { v4 as uuidv4 } from "uuid";

export default function ListBoxComponent() {
  const [groupState, setGroupState] = useState<{ 
      id: number; 
      name: string;
    }[]>([
    { id: 1, name: "group 1" },
    { id: 2, name: "group 2" },
    { id: 3, name: "group 3" },
  ]);

  const [state, setState] = useState<{ 
      id: string; 
      name: string; 
      groupId: number | null;
    }[]>([
    { id: "ffff", name: "shrek", groupId: 1 },
    { id: "ffff2", name: "shrek2", groupId: 1 },
    { id: "ffff3", name: "shrek3", groupId: null },
    { id: "ffff7", name: "shrek7", groupId: null },
    { id: "ffff8", name: "shrek8", groupId: null },
    { id: "ffff4", name: "shrek4", groupId: 2 },
    { id: "ffff5", name: "shrek5", groupId: 3 },
    { id: "ffff6", name: "shrek6", groupId: 3 },
  ]);

  function setItemName(id: string, name: string) {
    setState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name } : item))
    );
  }

  function addItem() {
    setState([
      ...state,
      { id: uuidv4(), name: "", groupId: null }, // default unassigned
    ]);
  }

  function setGroupName(id: number, name: string) {
    setGroupState((prev) =>
      prev.map((group) => (group.id === id ? { ...group, name } : group))
    );
  }

  function seeCurrentGroups() {
    console.log(groupState);
  }

  return (
    <div className="w-full flex flex-col p-[24px] border-2 rounded-2xl border-offOffBlack flex-1 min-h-0">

      <div className="flex flex-row items-center justify-end">
        <div className="flex flex-row items-center gap-[8px]">
          <Plus className="w-[16px] h-[16px]" />
          <button onClick={addItem}>New item</button>
          <button onClick={seeCurrentGroups}>See current groups</button> 
        </div>
      </div>

      {/* Spacer */}
      {/* <div className="flex-[0.1] w-full" /> */}

      {/* Groups */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {groupState.map((group) => (
          <div
            key={group.id}
            className="flex flex-col w-full bg-offOffBlack rounded-lg mb-4"
          >
            <input className="p-2 text-white " onChange={(e) => setGroupName(group.id, e.target.value)} value={group.name} />

            {/* Items for this group */}
            <ReactSortable
              list={state.filter((s) => s.groupId === group.id)}
              setList={(newList) => {
                // update groupId for moved items
                setState((prev) =>
                  prev.map((item) => {
                    const match = newList.find((nl) => nl.id === item.id);
                    return match ? { ...match, groupId: group.id } : item;
                  })
                );
              }}
              group="shared"
              animation={150}
            >
              {state
                .filter((s) => s.groupId === group.id)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-row items-center justify-between gap-[10px] p-2 bg-white rounded mb-2"
                  >
                    <Menu className="w-[16px] h-[16px] text-offOffBlack" />
                    <WordBarComponent
                      placeholder="Item name"
                      max={60}
                      value={item.name}
                      onChange={(value) => setItemName(item.id, value)}
                      passwordBoolean={false}
                    />
                  </div>
                ))}
            </ReactSortable>
          </div>
        ))}
      </div>

      {/* Unassigned pool */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="font-bold">Unassigned</div>
        <ReactSortable  
          list={state.filter((s) => s.groupId === null)}
          setList={(newList) => {
            setState((prev) =>
              prev.map((item) => {
                const match = newList.find((nl) => nl.id === item.id);
                return match ? { ...match, groupId: null } : item;
              })
            );
          }}
          group="shared"
          animation={150}
        >
          {state
            .filter((s) => s.groupId === null)
            .map((item) => (
              <div
                key={item.id}
                className="flex flex-row items-center justify-between gap-[10px] p-2 bg-gray-200 rounded mb-2"
              >
                <Menu className="w-[16px] h-[16px] text-offOffBlack" />
                <WordBarComponent
                  placeholder="Item name"
                  max={60}
                  value={item.name}
                  onChange={(value) => setItemName(item.id, value)}
                  passwordBoolean={false}
                />
              </div>
            ))}
        </ReactSortable>
      </div>
    </div>
  );
}
