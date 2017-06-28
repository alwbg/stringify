/**
 *  @autor alwbg@163.com | soei
 * creation-time : 2017-06-28 09:24:54 AM
 */
;(function( global, factory ){
	global[ 'global' ] = global; 
	if( typeof exports === 'object' ) {
		factory( require, exports, module );
	} else if (typeof define === 'function') {
		//AMD CMD
		define( 'stringify', factory );
	} else {
		var module = { exports : {} }
		factory( new Function, module.exports, module );
		global['stringify'] = module.exports;
	}
}( this, function( require, exports, module ) {
	var __source_ = /\[object (\w*)\]/g;
	/**
	 * 获取数据类型
	 * @param  {Object} source 需要验证的数据
	 * @return {String}        数据类型  eg. [object string]
	 */
	function _toSource__( source ){
		return Object.prototype.toString.call( source );
	}
	var that = this;
	exports.stringify = function( O, line, sel ) {
		var self = arguments.callee;
		if ( typeof line == 'string' ) {
			sel = line;
			line = null;
		}
		line            = line || [];
		var isArray     = O instanceof Array,
			brac        = self.static[ isArray? 'brackets' : 'braces' ],
			quote       = sel || '"',
			count       = 0,
			key, v, type, fx;

		line.push( brac.left );
		for ( key in O ) {
			if ( ! O.hasOwnProperty( key ) ) continue;
			if ( count++ ) line.push( ',' );

			if ( ! isArray ) line.push( quote, key.toString(), quote, ':' );

			v       = O[ key ];
			type    = _toSource__( v ).replace( __source_, '$1' ).toLowerCase();

			type    =  v && v.nodeType && 'html' || self.map[ type ] || 'object' ;
			fx      = self[ type ];

			fx( line, v, quote );
		}
		line.push( brac.right );
		return line.join( '' );
	};
	exports.stringify.static = {
		//方括号
		brackets : {
			left : '[',
			right: ']'
		},
		braces : {
			left : '{',
			right: '}'
		}

	}
	exports.stringify.map = {
		'number'    : 'simply',
		'boolean'   : 'simply',
		'null'      : 'simply',
		'undefined' : 'simply',
		'string'    : 'string',
		'function'  : 'func',
		'html'      : 'html'
	}
	/**
	 * 非字符 分支
	 */
	exports.stringify.simply = function( line, v ){
		line.push( v + '' );
	}

	exports.stringify.func = function( line, v ){
		line.push( 'Function' );
	}

	exports.stringify.html = function( line, v ){
		line.push( '' );
	}
	/**
	 * 字符类型
	 */
	exports.stringify.string = function( line, v, quote ){
		if( v.indexOf( quote ) >= 0 )
			v = v.replace( new RegExp( quote, 'ig' ), '\\' + quote );
		line.push( quote, v , quote );
	}
	/**
	 * 对象
	 */
	exports.stringify.object = function( line, v, quote ){
		exports.stringify( v, line, quote );
	}

	/**
	 * 获取对象中的指定属性
	 * @param  {Object} data 	要操作的对象
	 * @param  {Array} 	pick 	指定的属性集合
	 * @return {JSON}     		筛选出来的属性
	 */
	exports.pick = function( data, pick ){
		if( ! (pick instanceof Array) ) return data;
		var __data_ = {}, key, isIn;
		for( var i = 0, length = pick.length; i < length; i++ ){
			key = pick[ i ];
			isIn = key in data;
			if( ! isIn ) continue;
			__data_[ key ] = data[ key ];
		}
		return __data_;
	}
}))