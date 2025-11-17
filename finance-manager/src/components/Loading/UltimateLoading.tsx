'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Waves } from 'lucide-react';

export default function UltimateLoading() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7]
    }
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const waveVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
            style={{
              left: `${10 + i * 7}%`,
              top: `${5 + i * 8}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
        
        {/* Grid Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Central Logo/Icon */}
        <motion.div
          variants={itemVariants}
          className="relative mb-8"
        >
          <motion.div
            variants={pulseVariants}
            animate="animate"
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            {/* Outer ring */}
            <div className="absolute inset-0 bg-gradient-to-r from-financial-500 to-blue-500 rounded-full blur-xl opacity-50" />
            
            {/* Middle ring */}
            <motion.div
              variants={orbitVariants}
              animate="animate"
              className="absolute inset-4 border-2 border-white/20 rounded-full"
            >
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                  rotate: -360
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Sparkles className="h-4 w-4 text-financial-400" />
              </motion.div>
            </motion.div>
            
            {/* Center icon */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border-2 border-white/20 shadow-2xl">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="text-financial-400"
              >
                <Zap className="h-10 w-10" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-financial-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Finance Manager
          </h1>
          <p className="text-gray-400 text-lg">Chargement de l'interface ultime...</p>
        </motion.div>

        {/* Animated Elements */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          {/* Wave Effect */}
          <motion.div
            variants={waveVariants}
            animate="animate"
            className="text-financial-400"
          >
            <Waves className="h-8 w-8" />
          </motion.div>

          {/* Pulsing Dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-financial-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Sparkles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="text-financial-400"
          >
            <Sparkles className="h-8 w-8" />
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div variants={itemVariants} className="w-64 mx-auto">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
            <motion.div
              className="h-full bg-gradient-to-r from-financial-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Initialisation...</span>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              UI Ultime
            </motion.span>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-financial-400/30"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}