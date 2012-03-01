describe("UTFGrid", function() {
    
    function indexFromCharCode(charCode) {
        if (charCode >= 93) {
            charCode--;
        }
        if (charCode >= 35) {
            charCode --;
        }
        return charCode - 32;
    }

    function getFeatureId(obj, resolution, i, j) {
        var id = null;
        var row = Math.floor(j / resolution);
        var col = Math.floor(i / resolution);
        var charCode = obj.grid[row].charCodeAt(col);
        var index = indexFromCharCode(charCode);
        if (!isNaN(index) && (index in obj.keys)) {
            id = obj.keys[index];
        }
        return id;
    }

    it("should work", function() {
        
        var request;

        runs(function() {
            request = new XMLHttpRequest();
            request.open("GET", "../demo.json");
            request.send(null);
        });
        
        waitsFor(function() {
            return request.readyState == 4 && request.status >= 200 && request.status < 300;
        }, "demo.json failed to load", 5000);
        
        var obj;
        runs(function() {
            obj = JSON.parse(request.responseText);
            expect(typeof obj).toBe("object");
        });
        
        runs(function() {
            var got, exp, failure;
            outer: for (var y=0; y<256; ++y) {
                for (var x=0; x<256; ++x) {
                    if (y<255 || x<222) {
                        exp = String((y * 256) + x);
                    } else {
                        exp = "65501";
                    }
                    got = getFeatureId(obj, 1, x, y);
                    expect(got).toBe(exp);
                    if (got !== exp) {
                        // hack for jasmine's lack of messaging
                        failure = "Failed to get id for (" + x + ", " + y + "): " +
                            "got " + got + " but expected " + exp;
                        
                        break outer;
                    }
                }
            }
            
            expect(failure).toBeFalsy();
        });
        
        
    })
});
