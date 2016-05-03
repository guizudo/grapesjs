var path = 'StyleManager/view/';
define([path + 'PropertyView', 'StyleManager/model/Property', 'DomComponents/model/Component'],
  function(PropertyView, Property, Component) {

    return {
      run : function(){

          describe('PropertyView', function() {

            var component;
            var $fixtures;
            var $fixture;
            var target;
            var model;
            var view;
            var propName = 'testprop';
            var propValue = 'testvalue';
            var defValue = 'testDefault';

            before(function () {
              $fixtures  = $("#fixtures");
              $fixture   = $('<div class="cssrule-fixture"></div>');
            });

            beforeEach(function () {
              target = new Component();
              component = new Component();
              model = new Property({property: propName});
              view = new PropertyView({
                model: model
              });
              $fixture.empty().appendTo($fixtures);
              $fixture.html(view.render().el);
            });

            afterEach(function () {
              //view.remove(); // strange errors ???
            });

            after(function () {
              $fixture.remove();
              delete component;
            });

            it('Rendered correctly', function() {
              var prop = view.el;
              $fixture.get(0).querySelector('.property').should.be.ok;
              prop.querySelector('.label').should.be.ok;
              prop.querySelector('.field').should.be.ok;
            });

            it('Input should exist', function() {
              view.$input.should.be.ok;
            });

            it('Input value is empty', function() {
              view.model.get('value').should.be.empty;
              view.$input.val().should.be.empty;
            });

            it('Model not change without update trigger', function() {
              view.$input.val(propValue);
              view.model.get('value').should.be.empty;
            });

            // Tests valueUpdated()
            it('Update model on input change', function() {
              view.$input.val(propValue).trigger('change');
              view.model.get('value').should.equal(propValue);
            });

            // Tests getValueForTarget()
            it('Get value for target', function() {
              view.model.set('value', propValue);
              view.getValueForTarget().should.equal(propValue);
            });

            // Tests valueChanged() -> ...
            it('Update input on value change', function() {
              view.model.set('value', propValue);
              view.$input.val().should.equal(propValue);
            });

            it('Update target on value change', function() {
              view.selectedComponent = component;
              view.model.set('value', propValue);
              var compStyle = view.selectedComponent.get('style');
              var assertStyle = {};
              assertStyle[propName] = propValue;
              compStyle.should.deep.equal(assertStyle);
            });

            it('Clean target from the property if its value is empty', function() {
              view.selectedComponent = component;
              view.model.set('value', propValue);
              view.model.set('value', '');
              var compStyle = view.selectedComponent.get('style');
              compStyle.should.deep.equal({});
            });

            it('Check stylable element', function() {
              view.selectedComponent = component;
              view.isTargetStylable().should.equal(true);
              component.set('stylable', false);
              view.isTargetStylable().should.equal(false);
              component.set('stylable', [propName]);
              view.isTargetStylable().should.equal(true);
              component.set('stylable', ['test1', propName]);
              view.isTargetStylable().should.equal(true);
              component.set('stylable', ['test1', 'test2']);
              view.isTargetStylable().should.equal(false);
            });

            it.skip('Get target style', function() {
              //getComponentValue
            });

            it.skip('Fetch value from function', function() {
              //fetchFromFunction
            });

            describe('With target setted', function() {

              beforeEach(function () {
                target.model = component;
                view = new PropertyView({
                  model: model,
                  propTarget: target
                });
                $fixture.empty().appendTo($fixtures);
                $fixture.html(view.render().el);
              });

              it('Update value on target swap', function() {
                var style = {};
                style[propName] = propValue;
                component.set('style', style);
                view.propTarget.trigger('update');
                view.model.get('value').should.equal(propValue);
              });

              it('Update value after multiple swaps', function() {
                var style = {};
                style[propName] = propValue;
                component.set('style', style);
                view.propTarget.trigger('update');
                style[propName] = propValue + '2';
                component.set('style', style);
                view.propTarget.trigger('update');
                view.model.get('value').should.equal(propValue + '2');
              });

            })

            describe('Init property', function() {

              beforeEach(function () {
                component = new Component();
                model = new Property({
                  property: propName,
                  defaults: defValue
                });
                view = new PropertyView({
                  model: model
                });
                $fixture.empty().appendTo($fixtures);
                $fixture.html(view.render().el);
              });

              it('Value as default', function() {
                view.model.get('value').should.equal(defValue);
              });

              it('Placeholder as default', function() {
                view.$input.attr('placeholder').should.equal(defValue);
              });

              it('Input value is empty', function() {
                view.$input.val().should.equal(defValue);
              });

            });

        });
      }
    };

});