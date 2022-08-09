
import classes from './UserProfile.module.css';
import ChangePasswordForm from './ChangePasswordForm';

const UserProfile = () => {

  
  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ChangePasswordForm />
    </section>
  );
};

export default UserProfile;
