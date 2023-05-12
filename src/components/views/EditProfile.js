import { useHistory, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Home.scss";
import React, { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import { Spinner } from "../ui/Spinner";
import { Button } from "../ui/Button";
import PropTypes from "prop-types";
import noAvatar from "image/noAvatar.png";
import UploadAvatar from 'components/firebase comps/uploadAvatar';
import "styles/views/EditProfile.scss";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        type={props.type}
        placeholder={props.placeholder}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
};

const EditProfile = () => {
  const history = useHistory();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const profileId = useParams().profileId;
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState(sessionStorage.getItem("username"));
  const [birthday, setBirthday] = useState(sessionStorage.getItem("birthday"));
  const [avatarUrl, setAvatarUrl] = useState(null);

  const types = ['image/png', 'image/jpeg'];

  const saveChanges = async () => {

    try {  
      console.log("Avatar", avatarUrl);
        const userId = profileId;
        const requestBody = JSON.stringify({ username, birthday, userId, avatarUrl });
        const response = await api.put("/users/" + profileId, requestBody);

        console.log(response);
  
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("birthday", birthday);
        sessionStorage.setItem("avatarUrl", avatarUrl);

        history.push(`/game/profile/` + profileId);

    } catch (error) {
      alert(
        `Something went wrong when trying to save: \n${handleError(error)}`
      );
    }
  };
    
  
    const handleChange = (e) => {
      let selected = e.target.files[0]; // to select the first file (in order someone selects more files)
      console.log(selected); 
      
      if (selected && types.includes(selected.type)) {
        setFile(selected);
        setError('');
      } else {
        setFile(null);
        setError('Please select an image file (png or jpg)');
      }
    };

  const logout = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      const response = await api.put("/logout/" + userId);
      console.log(response);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      history.push("/login");
    } catch (error) {
      alert(
        `Something went wrong when trying to logout: \n${handleError(error)}`
      );
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");
      history.push("/login");
    }
  };

  const returnToProfile = () => {
    history.push("/game/profile/" + profileId);
  };
    
      
  useEffect(() => {
    async function fetchProfile(profileId) {
      try {
        const response = await api.get("/users/" + profileId);
  
        setProfile(response.data);
  
        console.log("request to:", response.request.responseURL);
        console.log("status code:", response.status);
        console.log("status text:", response.statusText);
        console.log("requested data:", response.data);
      } catch (error) {
        alert(
          `Something went wrong while fetching the Profile: \n${handleError(
            error
          )}`
        );
      }
    }
    fetchProfile(profileId);
  }, [profileId]);
  



  let content = <Spinner />;

  if (profileId !== sessionStorage.getItem("userId")) {
    content = (
      <div className="profile">
        <p>
          This is not your profile and you are not allowed to edit it. <br />{" "}
          Please go to your own profile if you want to make edits
        </p>
        <Button width="100%" onClick={() => returnToProfile()}>
          Back
        </Button>
        <Button width="100%" onClick={() => logout()}>
          Logout
        </Button>{" "}
      </div>
    );
    console.log("profile ID: ", profileId);
    console.log("user ID: ", sessionStorage.getItem("userId"));
  } else if (profile) {
    content = (
      <div className="editProfile">
        <div className="editProfile container">
          <div className="editProfile form">
              <div class="image-upload">
          
                <label for="file-input">
                  {avatarUrl && <img alt="Avatar" src={avatarUrl}></img>}
                  {profile.avatarUrl && !avatarUrl && <img alt="Avatar" src={profile.avatarUrl}></img>}
                  {!profile.avatarUrl && !avatarUrl && <img alt="Avatar" src={noAvatar}></img>}
                  

                </label>
                <input id="file-input" type="file" onChange={handleChange}/>
            </div>
            { error && <div className="uploadAvatar output"><div className="error">{ error }</div></div>}
            { file && <div className="uploadAvatar output"><UploadAvatar file={file} setFile={setFile} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} /> </div>}
        <FormField
          label="New Username:"
          value={username}
          onChange={(un) => setUsername(un)}
          type="text"
          placeholder={profile.username}
        />
        <FormField
          label="New Birthday:"
          value={birthday}
          onChange={(bd) => setBirthday(bd)}
          type="date"
          placeholder={profile.birthday}
        />
        <Button width="100%" onClick={() => saveChanges()}>
          Save
        </Button>
        <Button width="100%" onClick={() => returnToProfile()}>
          Back
        </Button>
        <Button width="100%" onClick={() => logout()}>
          Logout
        </Button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <BaseContainer className="Home container">
      <h2>Edit Profile</h2>
      {content}
    </BaseContainer>
  );
};

export default EditProfile;
