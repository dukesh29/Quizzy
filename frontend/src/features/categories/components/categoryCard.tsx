import React from 'react';
import { Category } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { deleteCategory, fetchCategories } from '../categoryThunk';
import { selectDeleteCategoryLoading, selectDeleteError } from '../categorySlice';
import { Button, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { selectUser } from '../../users/usersSlice';
import { enqueueSnackbar } from 'notistack';
import '../category.scss';

interface Props {
  category: Category;
}

const CategoryCard: React.FC<Props> = ({ category }) => {
  const dispatch = useAppDispatch();
  const deleteLoading = useAppSelector(selectDeleteCategoryLoading);
  const user = useAppSelector(selectUser);
  const deleteError = useAppSelector(selectDeleteError);
  const onDelete = async (id: string) => {
    if (window.confirm('Вы действительно хотите удалить?')) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        dispatch(fetchCategories());
        enqueueSnackbar('Категория успешно удалена! ', {
          variant: 'success',
          autoHideDuration: 3000,
        });
      } catch (e) {
        enqueueSnackbar(`${deleteError?.message} `, {
          variant: 'error',
          autoHideDuration: 3000,
        });
        console.log(e);
      }
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
