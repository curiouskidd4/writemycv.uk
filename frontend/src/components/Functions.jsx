import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
// import { Meteor } from 'meteor/meteor';
// import { Roles } from 'meteor/alanning:roles';

export function dateFormat(date, format) {
  dayjs.extend(utc);
  // return dayjs(date).utc().format(format || 'MMM DD, YYYY');
  return dayjs(date).format(format || 'MMM DD, YYYY');

}

export function isEmail(email) {
  const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return filter.test(email);
}

export function isValidPassword(password) {
  return password.length > 6;
}

export function hasRights(roles, userId) {
  // console.log(Roles.getRolesForUser(Meteor.userId()))
  // let userId_ = userId || Meteor.userId()
  // console.log(roles, userId_)
  // return Roles.userIsInRole(userId_, roles);
  return true;
};