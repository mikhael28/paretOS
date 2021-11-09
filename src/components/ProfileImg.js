/**
 * @component ProfileImage
 * @desc Displays either the user's current profile image or a generic image if none exists
 * @param {Prop} profileImg-the profile image object
 */
export function ProfileImg({ profileImg }) {
    return (
        <div className="profile-image">
        {profileImg ? 
            <img src={profileImg} width="100%" height="100%" /> : 
            <>
                <div style={{backgroundColor: "white", borderRadius: "50%", width: "34%", height: "34%", transform: "translate(97%, 80%)"}}></div>
                <div style={{backgroundColor: "white", borderRadius: "50%",  width: "50%", height: "80%", transform: "translate(50%, 40%)"}}></div>
            </>
        }
      </div>
    )
}