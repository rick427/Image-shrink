### Image Shrink ###
Image shrink is a cross platform desktop application that reduces the size of uploaded images. The lower the range specified the lower the resolution. The application keeps a log  which can be accessed differently depending on which OS you're runnnig.
 - **On Windows** : %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log
 - **On Mac** : ~/Library/Logs/{app name}/{process type}.log
 - **On Linux** : ~/.config/{app name}/logs/{process type}.log

***

#### Technology ####
- Image shrink was built using the javascript ELECTRON framework. And as such, the application run on windows, mac and linux.
- The use of 3rd party libraries such as ***imagemin*** amongst others were employed to create the functionality listed above.

Accepted images formats include; JPEG and PNG only.

#### Demo The App ? ####
To launch a production demo of the app navigate to this folder from the root: *release-builds/ImageShrink-win32-ia32/ImageShrink.exe*

***

#### Screenshot Of The App ####
<img src="/screenshot/img.PNG" alt="imageMin" width="400">