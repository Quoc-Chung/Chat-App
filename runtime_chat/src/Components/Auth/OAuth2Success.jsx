import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { currentUser } from "../../Redux/Auth/Action";

const Oauth2Success = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem('token', token);
      

      dispatch(currentUser(token))
        .then(() => {
          navigate('/');
        })
        .catch(err => {
          console.error(err);
          navigate('/signin');
        });
      
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      navigate('/signin');
    }
  }, [navigate, dispatch]);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default Oauth2Success;
