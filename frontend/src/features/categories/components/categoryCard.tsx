import React from 'react';
import { Category } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { deleteCategory } from '../categoryThunk';
import { selectDeleteCategoryLoading } from '../categorySlice';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import '../category.scss';

interface Props {
  category: Category;
}

const CategoryCard: React.FC<Props> = ({ category }) => {
  const dispatch = useAppDispatch();
  const deleteLoading = useAppSelector(selectDeleteCategoryLoading);

  const onDelete = (id: string) => {
    if (window.confirm('Вы действительно хотите удалить?')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="card">
      <h3 className="card__title">{category.name}</h3>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => onDelete(category._id)}
        disabled={deleteLoading}
      >
        <DeleteIcon />
      </Button>
    </div>
  );
};

export default CategoryCard;
