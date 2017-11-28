# boxEZ
![boxez](https://user-images.githubusercontent.com/26106817/33115723-ea32b464-cf16-11e7-985b-cf8ff94335e2.jpg)
**Link to this project:** https://dl77sea-boxez.herokuapp.com

**Format:** Desktop Browser (not optimized for mobile)

**Description:** A web app that lets users create and edit boxes of varying size and shape, then share them on a public display area for other users to see. Users may view a public, paginated display of all boxes all users have created. Users may login or create a new user id to submit a box to the public display, delete one of their existing boxes, or edit one of their existing boxes; all such CRUD operations are reflected in the public view of boxes.

**How it works:** The boxEZ server maintains a PostgreSQL database, where all the boxes users have created are stored. The boxes are rendered into a paginated grid layout on HTML canvases, using the webGL framework BabylonJS. Box editing is handled with BabylonJS event handling framework that samples the users’ pointer in 3D space. The rotation of the view around the boxes in edit mode is handled by BabylonJS’s camera class. The front end is managed with AngularJS which updates pagination indication and the list of boxes currently being viewed as well as the user options available to the user. AngularJS also provides URL formatting via UI-Router. Materialize CSS framework and HTML are used to manage the layout. CRUD authorization and user verification is maintained with a JWT, issued upon successful sign-in. JWT verification is performed by authorization middleware per CRUD operation requested by user on their data to protect user’s data.
