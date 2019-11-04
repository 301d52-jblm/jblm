
Will, Lucas, Raven and Roslayn



# Wire Fames
![index-v1](https://github.com/301d52-jblm/jblm/blob/willday1/images_for_readme/wire-frame/jblm-index-v1.jpg)

#User Stories

<!-- 
Facebook Feed
  As a user, I want to see the JBLM Facebook feed, so that website visitors can see what’s going on with the organization.
    Feature Tasks:
      Add a call to the FB API to get the page feed and model it to render it on the page.
      Alternatively, embed the facebook page’s feed directly in the HTML.
    Acceptance Tests: 
      When the user visits the home page, they should see the latest posts from the JBLM facebook timeline.
Admin Route
As an administrator, I want a hidden administrator route, so that I can edit the calendar.
    Feature Tasks:
      Create routes with random letters/numbers for the names, so that they are hard to guess.
      These routes direct to a page where the calendar data in the database can be updated.
    Acceptance Tests:
      An admin with knowledge of the admin route name should be able to use that route to visit a page that allows the calendar DB data to be edited.
Redesign home page
As a user, I want to know all the site has to offer at a glance so that I can feel included.
    Feature Tasks:
      Reduce the size of the image carousel
Add a 3-section under the carousel containing Calendar, Events, and Contacts sections.
    Use UW-Tacoma site as a reference.
    Acceptance Tests:
      The home page should display events, contacts, and calendar information in a way that is easy to read and navigate. It should look similar to https://www.tacoma.uw.edu/.
Simplify calendar information
 -->

#Software Requirements

<!-- VISION -->
<!-- This product is meant to help the administrator and the visitors of the page alike. There is currently a divide in what users see vs what is available. This product will bridge that gap making it easy for users to get connected. This is important because it saves time, money and resources for our client. -->



<!-- SCOPE -->
<!-- IN -->
<!-- Our product will be easy for users to get connected to JBLM.
The web app will have a calender to show what events are upcoming.
The web app will have a facebook feed to keep people connected to whats going on.
The administrator will have a route to edit the calender events. -->

<!-- OUT -->
<!-- Our web app will only be editable by the admin. This means having a fairly secure route for the admin. This webb app will also be professional, not personal. So it needs to look the part. -->



<!-- MVP -->
<!-- Having a working API
Have the calender editable by the admin, also edit resources -->

<!-- STRETCH GOALS -->
<!-- Making the client happy
Make the cite pretty -->



<!-- FUNCTIONAL REQUIREMENTS -->
<!-- A admin can create and delete calender events.
User can update and create items on the resource page.
A User can view the calender and facebook feed along with other information about the base. -->



<!-- NON-FUNCTIONAL REQUIREMENTS -->
<!-- Secure for the admin route so only those who have the link can change the calender. This means that the admin will be able to keep the calender the way they want it. Secure means that it will not be reachable by users. It will be a route that ONLY the admin will have a link to.

Usability so users can easily manuever the cite. Usability means that it is easy for people who have never been on the cite to know what all the features are right away. We want this cite to be for everyone interested in JBLM events. -->



<!-- DATA FLOW -->
<!-- When a user comes to the cite they will see a navbar with an image carousal beneath it. under that there will be a facebook feed, calender/calender  events and contacts. You can click on the facebook feed and be on the facebook page. Click on the calender information and go to the full screen calender. Or click on the resources to see the full list of resources. All of these pages are also accessible by using the var bar which will be on each page. -->

#Domain Modeling

#Database Entity-Relationship-Diagram







-----------------------------------------------------------------

##
placeholder for dev branch ACP


# JBLM Unlimited Website
 VERSION 1.0.0

# Names of the team members:
Biniam Tesfamarian, Elle Young, Karina Chen, Jon Kimball

<!-- TODO: Clearly defined API endpoints with sample responses
Clearly defined database schemas -->
### 

### App Set Up Instructions
Once Google account and Heroku account are handovered to the client. The client should change the passwords right away. Then, the client will need to log in to Google account and edit google calendar settings, events, and schedules to client's desire. The google account can be shared with multiple admin users. For Heroku account, the client may change to their own desired hosted website if do not want to host the website with Heroku. For admin route to access Admin page for JBLM Unlimited, the client should contact developers to set up an unique route. If necessary, please see below NECESSARY PACKAGES to install all the midware we used to run this project.

**NECESSARY PACKAGES:**
Required: express, pg, fs, superagent, methodOverride

_**.env file setup**_ 

PORT:3000 || 3001

DATABASE_URL: postgres://localhost:5432/jblm_unlimited_cf19

**ADMIN_ROUTE: RESERVED FOR DEVELOPER PLEASE CONTACT**


### Project Description:
The JBLM Unlimited website will be used for service members to see a google calendar with events and links. There will be a Resource page that has all the contact information and links for JBLM's partners. An Admin page will also be built for admin users to add and edit information on the website. An admin route will be created and only the admin users who know the route url can access and make changes to the website.

### MEMBER USER STORIES:

As a JBLM member, I want to come to the Home page of this website to see a preview of the 5 upcoming events shown on the Home page, so I can know what events are coming soon without having to go to the Calendar page.

As a JBLM member, I want to be able to contact JBLM's admin on the Home page through social media links or email links, so I can know the contact information once I come to this website. 

As a JBLM member, I want to come to this website to see a calendar with all the upcoming events and all the past events, so I can plan my schedule accordingly to the event schedules.

As a JBLM member, I want to click on the events in the calendar to see more details about the events, so I can know more about the events.

As a JBLM member, I want to see all the contact information of JBLM's partners on Resource page, so I can contact them if I need to.

### ADMIN USER STORIES:

As an admin user, I want to have a calendar that goes into future dates , so I can put events on the calendar early in the time for coordination purposes.

As an admin user, I want the calendar to show all the past events, so the JBLM's members and I can go back and reference something if needed.

As an admin user, I want to be able to mark each event to set its priority, so the event which is set as high priority will be displayed on the Home page, otherwise the event will only be shown in the calendar but not on the Home page.

As an admin user, I want the Resource page to show JBLM's partners' titles, logos, brief descriptions, and url links.

As an admin user, I want to be able to add and change information about events and resources on this website.

As an admin user, I want to have some sort of portal security so only the admin users can change events and resources information on this website.

### Project Scope:

_MVP -_

Calendar Page:
Use Google Calendar API to show all the events. Click on an event then the detail view shows up. The calendar needs to be scrollable or clickable to show previous and furture calendar. Inside the detail view of an event, the link should bring the users to the event page outside of JBLM Unlimited.

Admin Page:
The admin page allows the admin users to add a new resource to the database, which then adds the resource event to the resources page list.

Home Page:
Have a Home page to show image slides, the top 5 upcoming events, and social media links to contact JBLM.

Resource Page:
Have a Resource page that shows all the contact information and basic companies/institudes descriptions of JBLM's partners.

_Stretch Goals -_

Calendar Page:
Inside the view detail page of each event, be able to attach PDF files or fliers.

Admin Page:
Create a basic username/password login security system for admin users. Let the admin users to update/change events on Calendar page and on Resource page.



### Special thanks to all the people of the internet that helped! Here is our resource list:

https://docs.google.com/document/d/1Kf0oJOv7DQVtcTo5k2G7Mlmh3PCyHBKwK9B86Hl5K-s/edit?usp=sharing
