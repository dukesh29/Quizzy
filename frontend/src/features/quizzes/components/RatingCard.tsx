import * as React from 'react';
import Rating from '@mui/material/Rating';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import { RatingType } from '../../../types';
import { useEffect } from 'react';
import { updateQuizRating } from '../quizThunk';

interface Props {
  rating: RatingType[];
  id: string;
}

const RatingCard: React.FC<Props> = ({ rating, id }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [value, setValue] = React.useState<number | null>(0);

  const calculateAverageRating = (ratings: RatingType[]) => {
    if (ratings.length === 0) {
      return 0;
    }
    const sum = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0);
    const average = sum / ratings.length;
    const averageRating = Math.ceil(average);
    setValue(averageRating);
  };

  useEffect(() => {
    calculateAverageRating(rating);
  }, [rating]);

  return (
    <>
      {user ? (
        <Rating
          name="simple-controlled"
          sx={{ mr: 1 }}
          value={value}
          onChange={async (event, newValue) => {
            setValue(newValue);
            await dispatch(updateQuizRating({ rating: newValue, user: user?._id, id: id }));
          }}
        />
      ) : (
        <Rating sx={{ mr: 1 }} name="read-only" value={value} readOnly />
      )}
    </>
  );
};

export default RatingCard;
