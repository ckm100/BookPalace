var books = require("google-books-search");

module.exports = function (app, passport, User) {

    app.get("/logout", function (req, res) {

        req.logout();

        res.redirect("/");

    });

    app.get("/", function (req, res, next) {

        if (req.isAuthenticated()) {

            User.find({}, function (err, doc) {

                if (err) {

                    res.end('Internal Server Error, please try again. If you keep encountering the problem, you can please contact me at kufogbemawuli1@gmail.com');

                } else {

                    res.render("index", {
                        auth: true,
                        data: doc
                    });
                }

            });

        } else {

            User.find({}, function (err, doc) {

                if (err) {

                    res.end('Internal Server Error, please try again. If you keep encountering the problem, you can please contact me at kufogbemawuli1@gmail.com');

                } else {

                    res.render("index", {
                        auth: false,
                        data: doc
                    });
                }

            });

        }

    });

    app.get("/allbooks", function (req, res) {

        if (req.isAuthenticated()) {

            User.find({}, function (err, doc) {

                if (err) {

                    res.end('Internal Server Error, please try again. If you keep encountering the problem, you can please contact me at kufogbemawuli1@gmail.com');

                } else {

                    User.findOne({
                        _id: req.user._id
                    }, function (err, data) {

                        if (err) {

                            res.end('Internal Server Error, please try again. If you keep encountering the problem, you can please contact me at kufogbemawuli1@gmail.com');

                        } else {

                            res.render("allbooks", {
                                data: doc,
                                currentUser: data
                            });

                        }

                    });
                }

            });

        } else {

            res.redirect("/");

        }

    });

    app.get("/mybooks", function (req, res) {

        if (req.isAuthenticated()) {

            User.findOne({

                _id: req.user._id

            }, function (err, doc) {

                if (err) {

                    res.end('Internal Server Error, please try again. If you keep encountering the problem, you can please contact me at kufogbemawuli1@gmail.com');

                } else {

                    res.render("mybooks", {

                        data: doc.bookData,
                        allData: doc
                    });
                }

            });

        } else {
            res.redirect("/");
        }

    });

    app.post("/bookrequest", function (req, res) {

        var userId = req.body.userId,
            bookId = req.body.bookId,
            bookName = req.body.bookName;

        User.findOne({
            _id: userId
        }, function (err, doc) {

            doc.requestFrom.push({
                bookName: bookName,
                requestUserName: req.user.uname,
                requestUserId: req.user._id,
                bookId: bookId
            });

            doc.save(function (err) {

                if (err) {
                    return err;
                } else {

                    User.findOne({

                        _id: req.user._id

                    }, function (err, data) {

                        if (err) {
                            return err;
                        } else {

                            data.requestTo.push(bookId);

                            data.save(function (err) {

                                if (err) {
                                    return err;
                                } else {
                                    res.end();
                                }

                            });

                        }

                    });

                }

            });

        });

    });

    app.post("/cancelrequest", function (req, res) {

        var userId = req.body.userId,
            bookId = req.body.bookId;

        User.findOne({
            _id: userId
        }, function (err, doc) {

            for (var i = 0; i < doc.requestFrom.length; i++) {

                if (doc.requestFrom[i].bookId === bookId) {

                    doc.requestFrom.splice(i, 1);

                }

            }

            doc.save(function (err) {

                if (err) {
                    return err;
                } else {

                    User.findOne({

                        _id: req.user._id

                    }, function (err, data) {

                        if (err) {
                            return err;
                        } else {

                            data.requestTo.splice(data.requestTo.indexOf(bookId), 1);

                            data.save(function (err) {

                                if (err) {
                                    return err;
                                } else {
                                    res.end();
                                }

                            });

                        }

                    });

                }

            });

        });

    });

    app.post("/acceptrequest", function (req, res) {

        var userId = req.body.userId,
            bookId = req.body.bookId;

        User.findOne({
            _id: userId
        }, function (err, doc) {

            if (err) {
                return err;
            } else {

                User.findOne({
                    _id: req.user._id
                }, function (err, data) {

                    var bookPos;

                    if (err) {
                        return err;
                    } else {

                        bookPos = data.bookId.indexOf(bookId);

                        doc.bookId.push(bookId);

                        doc.requestApprove.push(bookId);

                        doc.bookData.push(data.bookData[bookPos]);

                        doc.requestTo.splice(doc.requestTo.indexOf(bookId), 1);

                        for (var i = 0; i < data.requestFrom.length; i++) {

                            if (data.requestFrom[i].bookId === bookId) {

                                data.requestFrom.splice(i, 1);

                            }

                        }

                        doc.save(function (err) {

                            if (err) {
                                return err;
                            } else {

                                data.save(function (err) {

                                    if (err) {

                                        return err;

                                    } else {
                                        res.end();

                                    }

                                });

                            }

                        });

                    }

                });

            }

        });

    });

    app.post("/declinerequest", function (req, res) {

        var userId = req.body.userId,
            bookId = req.body.bookId;

        User.findOne({
            _id: userId
        }, function (err, doc) {

            doc.requestTo.splice(doc.requestTo.indexOf(bookId), 1);

            doc.save(function (err) {

                if (err) {
                    return err;
                } else {

                    User.findOne({

                        _id: req.user._id

                    }, function (err, data) {

                        if (err) {
                            return err;
                        } else {

                            for (var i = 0; i < data.requestFrom.length; i++) {

                                if (data.requestFrom[i].bookId === bookId) {

                                    data.requestFrom.splice(i, 1);

                                }

                            }

                            data.save(function (err) {

                                if (err) {
                                    return err;
                                } else {
                                    res.end();
                                }

                            });

                        }

                    });

                }

            });

        });

    });

    app.post("/addbook", function (req, res) {

        var bookName = req.body.bookName;

        books.search(bookName, function (err, results) {

            if (err) {

                return err;
                
            } else {

                User.findOne({

                    _id: req.user._id

                }, function (err, doc) {

                    if (err) {
                        return err;

                    } else {

                        doc.bookData.push({

                            title: results[0].title,
                            authors: results[0].authors,
                            publisher: results[0].publisher,
                            publishedDate: results[0].publishedDate,
                            thumbnail: results[0].thumbnail,
                            link: results[0].link,
                            id: results[0].id

                        });

                        doc.bookId.push(doc.bookData[doc.bookData.length - 1]._id.toString());

                        doc.save(function (err) {

                            if (err) {
                                return err;
                            } else {

                                User.findOne({

                                    _id: req.user._id

                                }, function (err, data) {

                                    if (err) {
                                        return err;
                                    } else {

                                        res.render("book", {
                                            data: data.bookData,
                                            allData: doc
                                        });
                                    }

                                });

                            }

                        });

                    }

                });

            }

        });

    });

    app.get("/settings", function (req, res) {

        if (req.isAuthenticated()) {
            res.render("settings");
        } else {
            res.redirect("/");
        }

    });

    app.post("/update", function (req, res) {

        var updateName = req.body.updateName,
            updateCity = req.body.updateCity,
            updateState = req.body.updateState;

        User.findOne({
            _id: req.user._id
        }, function (err, data) {

            if (err) {
                return err;
            } else {

                data.uname = updateName;
                data.city = updateCity;
                data.state = updateState;

                data.save(function (err) {

                    if (err) {
                        return err;
                    } else {

                        res.end();

                    }

                });

            }

        });

    });

    app.post('/login', function (req, res, next) {

        passport.authenticate('login', function (err, user, info) {

            if (err) {

                return next(err);
            }

            if (!user) {

                var er = req.flash("message")[0];

                res.json({
                    error: er
                });

            } else {

                req.login(user, function (err) {

                    if (err) {

                        return next(err);

                    } else {

                        res.redirect("/mybooks");

                    }

                });
            }

        })(req, res, next);

    });

    app.post('/signup', function (req, res, next) {

        passport.authenticate('signup', function (err, user, info) {

            if (err) {

                return err;
            }
            if (!user) {

                var er = req.flash("message")[0];

                res.json({
                    error: er
                });

            } else {

                req.login(user, function (err) {

                    if (err) {

                        return next(err);

                    } else {

                        res.redirect("/mybooks");

                    }

                });

            }

        })(req, res, next);

    });

}
