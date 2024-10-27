const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  // Create an issue with every field: POST request to /api/issues/{project}
  test("Create an issue with every field", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
        issue_text: "Text",
        created_by: "Function Test - Every Field",
        assigned_to: "Chai",
        status_text: "In QA",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "Text");
        assert.equal(res.body.created_by, "Function Test - Every Field");
        assert.equal(res.body.assigned_to, "Chai");
        assert.equal(res.body.status_text, "In QA");
        done();
      })
  });

  // Create an issue with only required fields: POST request to /api/issues/{project}
  test("Create an issue with only required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
        issue_text: "Text",
        created_by: "Function Test - Only Required Fields",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Title");
        assert.equal(res.body.issue_text, "Text");
        assert.equal(
          res.body.created_by,
          "Function Test - Only Required Fields"
        );
        done();
      })
  });

  // Create an issue with missing required fields: POST request to /api/issues/{project}
  test("Create an issue with missing required fields", function (done) {
    chai
      .request(server)
      .post("/api/issues/test")
      .send({
        issue_title: "Title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");
        done();
      })
  });

  // View issues on a project: GET request to /api/issues/{project}
  test("View issues on a project", function (done) {
    chai
      .request(server)
      .get("/api/issues/test")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      })
  });

  // View issues on a project with one filter: GET request to /api/issues/{project}
  test("View issues on a project with one filter", function (done) {
    chai
      .request(server)
      .get("/api/issues/test?issue_title=Title")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      })
  });

  // View issues on a project with multiple filters: GET request to /api/issues/{project}
  test("View issues on a project with multiple filters", function (done) {
    chai
      .request(server)
      .get("/api/issues/test?issue_title=Title&issue_text=Text")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      })
  });

  // Update one field on an issue: PUT request to /api/issues/{project}
  test("Update one field on an issue", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        _id: "1",
        issue_title: "Updated Title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "1");
        done();
      })
  });

  // Update multiple fields on an issue: PUT request to /api/issues/{project}
  test("Update multiple fields on an issue", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        _id: "1",
        issue_title: "Updated Title",
        issue_text: "Updated Text",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "1");
        done();
      })
  });

  // Update an issue with missing _id: PUT request to /api/issues/{project}
  test("Update an issue with missing _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        issue_title: "Updated Title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      })
  });

  // Update an issue with no fields to update: PUT request to /api/issues/{project}
  test("Update an issue with no fields to update", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        _id: "1",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "no update field(s) sent");
        assert.equal(res.body._id, "1");
        done();
      })
  });

  // Update an issue with an invalid _id: PUT request to /api/issues/{project}
  test("Update an issue with an invalid _id", function (done) {
    chai
      .request(server)
      .put("/api/issues/test")
      .send({
        _id: "invalid_id",
        issue_title: "Updated Title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not update");
        assert.equal(res.body._id, "invalid_id");
        done();
      })
  });

  // Delete an issue: DELETE request to /api/issues/{project}
  test("Delete an issue", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({
        _id: "1",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, "1");
        done();
      })
  });

  // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
  test("Delete an issue with an invalid _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .send({
        _id: "invalid_id",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body._id, "invalid_id");
        done();
      })
  });

  // Delete an issue with missing _id: DELETE request to /api/issues/{project}
  test("Delete an issue with missing _id", function (done) {
    chai
      .request(server)
      .delete("/api/issues/test")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      })
  });
});
