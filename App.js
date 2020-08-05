import React, { Component } from "react";
import { View, Button, TextInput } from "react-native";
import axios from "axios";
import { UsersSchema, USER_SCHEMA } from "./allschema";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";

const Realm = require("realm");
const databaseOptions = {
  path: "realmT4.realm",
  schema: [UsersSchema],
  schemaVersion: 0,
};
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: null,
      size: 0,
      runTime: 0,
      findName: "",
      text: "",
      updateText: "",
    };
  }
  componentWillMount() {
    Realm.open(databaseOptions).then((realm) => {
      this.setState({ size: realm.objects(USER_SCHEMA).length });
    });
  }
  downloadEvents() {
    const startTime = new Date().getTime();
    axios
      .post("https://www.bazzle.com.au/api/tabs/AccountTab/Login", {
        username: "bazzle-superadmin",
        password: "Admin@123",
      })
      .then((response) => {
        Realm.open(databaseOptions).then((realm) => {
          realm.write(() => {
            response.data["users"].forEach((obj) => {
              realm.create(USER_SCHEMA, obj);
            });
            this.setState({ size: realm.objects(USER_SCHEMA).length });
            const endTime = new Date().getTime();
            this.setState({ runTime: endTime - startTime });
          });
        });
      });
  }
  uploadEvents() {}
  clearAllEvents() {
    const startTime = new Date().getTime();
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {
          const allUsers = realm.objects(USER_SCHEMA);
          realm.delete(allUsers); // Deletes all books
          this.setState({ size: realm.objects(USER_SCHEMA).length });
          const endTime = new Date().getTime();
          this.setState({ runTime: endTime - startTime });
        });
      })
      .catch((error) => {});
  }
  findID() {
    const startTime = new Date().getTime();
    const text = this.state.text;
    const num = JSON.stringify(text);
    Realm.open(databaseOptions)
      .then((realm) => {
        const res = realm.objects(USER_SCHEMA).filtered(`passCode=${num}`);
        this.setState({ findName: res[0].userName });
        console.log(res[0].userName);
        const endTime = new Date().getTime();
        this.setState({ runTime: endTime - startTime });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  findName() {
    const startTime = new Date().getTime();
    const text = this.state.text;
    Realm.open(databaseOptions)
      .then((realm) => {
        const res = realm.objects(USER_SCHEMA).filtered(`userName="${text}"`);
        this.setState({ findName: res[0].userName });
        console.log(typeof res[0].passCode);

        const endTime = new Date().getTime();
        this.setState({ runTime: endTime - startTime });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  updateName() {
    const startTime = new Date().getTime();
    const updateText = this.state.updateText;
    const text = this.state.text;
    Realm.open(databaseOptions).then((realm) => {
      let target = realm.objects(USER_SCHEMA).filtered(`id=${text}`)[0];
      if (!target) {
        target = realm.objects(USER_SCHEMA).filtered(`userName=${text}`)[0];
      }
      realm.write(() => {
        target.EventName = updateText;
      });
      const endTime = new Date().getTime();
      this.setState({ runTime: endTime - startTime });
    });
  }
  render() {
    const info = "Number of items in this Realm: " + this.state.size;
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <View>
          <Text>{info}</Text>
          <Text>Execution time: {this.state.runTime} ms</Text>
          <Button onPress={this.downloadEvents.bind(this)} title="Download" />
          <Button onPress={this.uploadEvents.bind(this)} title="Upload" />
          <Button onPress={this.clearAllEvents.bind(this)} title="Delete All" />
          <TextInput
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />
          <Button onPress={this.findID.bind(this)} title="Find by ID" />
          <Button onPress={this.findName.bind(this)} title="Find by Name" />
          <Text>Find user: {this.state.findName}</Text>
          <Text>Update above user name to:</Text>
          <TextInput
            onChangeText={(updateText) => this.setState({ updateText })}
            value={this.state.updateText}
          />
          <Button onPress={this.updateName.bind(this)} title="Update Name" />
        </View>
      </ApplicationProvider>
    );
  }
}
