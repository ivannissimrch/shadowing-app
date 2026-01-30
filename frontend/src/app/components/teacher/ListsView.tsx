"use client";
import { List } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import { useState } from "react";
import DeleteListModal from "./DeleteListModal";
import AddListModal from "./AddListModal";
import CardGrid from "../ui/CardGrid";
import ListCard from "./ListCard";

export default function ListsView() {
  const { data: lists } = useSWRAxios<List[]>(API_PATHS.ALL_LISTS);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [listToDelete, setListToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  function handleDeleteList(list: List) {
    setListToDelete({ id: list.id, name: list.name });
    setIsDeleteModalOpen(true);
  }

  function handleEditList(list: List) {
    setSelectedList(list);
    setIsEditModalOpen(true);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
    setListToDelete(null);
  }

  function handleCloseEditModal() {
    setIsEditModalOpen(false);
    setSelectedList(null);
  }

  return (
    <>
      <CardGrid>
        {lists && (
          <ListCard
            lists={lists}
            onDeleteList={handleDeleteList}
            onEditList={handleEditList}
          />
        )}
      </CardGrid>

      {listToDelete && (
        <DeleteListModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          listId={listToDelete.id}
          listName={listToDelete.name}
        />
      )}

      <AddListModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        list={selectedList}
      />
    </>
  );
}
