import React from 'react';
import { Category } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { deleteCategory } from '../categoryThunk';
import { selectDeleteCategoryLoading } from '../categorySlice';
import { Button, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { selectUser } from '../../users/usersSlice';
import '../category.scss';
import { enqueueSnackbar } from 'notistack';

interface Props {
  category: Category;
}

const CategoryCard: React.FC<Props> = ({ category }) => {
  const dispatch = useAppDispatch();
  const deleteLoading = useAppSelector(selectDeleteCategoryLoading);
  const user = useAppSelector(selectUser);
  const onDelete = (id: string) => {
    if (window.confirm('Вы действительно хотите удалить?')) {
      dispatch(deleteCategory(id));
      enqueueSnackbar('Категория успешно удалена! ', {
        variant: 'success',
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <div className="card">
      <h3 className="card__title">{category.name}</h3>
      {user && user.role === 'admin' && (
        <>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => onDelete(category._id)}
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress color="secondary" size="small" /> : <DeleteIcon />}
          </Button>
        </>
      )}
    </div>
  );
};

export default CategoryCard;
